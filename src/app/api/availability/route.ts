import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const SLOT_MINUTES = 30;
const BUFFER_MINUTES = 30;

type Interval = { start: number; end: number };

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function formatMinutes(total: number) {
  const h = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const m = Math.floor(total % 60)
    .toString()
    .padStart(2, "0");
  return `${h}:${m}`;
}

function parseSlot(slot: string | null | undefined): Interval | null {
  if (!slot) return null;
  const parts = slot.split("-");
  if (parts.length !== 2) return null;
  const start = toMinutes(parts[0]);
  const end = toMinutes(parts[1]);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;
  return { start, end };
}

function intervalsOverlap(a: Interval, b: Interval) {
  return a.start < b.end && b.start < a.end;
}

function getWorkHours(date: Date) {
  const day = date.getDay();
  if (day === 0) return null;
  if (day === 6) return { start: toMinutes("09:00"), end: toMinutes("15:00") };
  return { start: toMinutes("08:00"), end: toMinutes("18:00") };
}

function parseDuration(raw: string | null) {
  const parsed = Number(raw || 0);
  if (!Number.isFinite(parsed) || parsed <= 0) return 120;
  return Math.max(30, Math.floor(parsed));
}

function buildSlots(work: Interval, durationMin: number) {
  const slots: Array<{ start: string; end: string; label: string }> = [];
  for (let start = work.start; start + durationMin <= work.end; start += SLOT_MINUTES) {
    const candidate: Interval = { start, end: start + durationMin };
    slots.push({
      start: formatMinutes(candidate.start),
      end: formatMinutes(candidate.end),
      label: `${formatMinutes(candidate.start)}-${formatMinutes(candidate.end)}`,
    });
  }
  return slots;
}

export async function GET(req: NextRequest) {
  try {
    const dateStr = req.nextUrl.searchParams.get("date");
    const durationMin = parseDuration(req.nextUrl.searchParams.get("duration"));
    if (!dateStr) {
      return NextResponse.json({ success: false, error: "date ist erforderlich" }, { status: 400 });
    }

    const selectedDate = new Date(`${dateStr}T00:00:00`);
    if (Number.isNaN(selectedDate.getTime())) {
      return NextResponse.json({ success: false, error: "Ungültiges Datum" }, { status: 400 });
    }

    const work = getWorkHours(selectedDate);
    if (!work) {
      return NextResponse.json({ success: true, date: dateStr, durationMin, slots: [], fullyBooked: true });
    }

    const startDay = new Date(selectedDate);
    startDay.setHours(0, 0, 0, 0);
    const endDay = new Date(selectedDate);
    endDay.setHours(23, 59, 59, 999);

    let orders: Array<{ timeSlot: string | null; bookedHours: number | null }> = [];
    let fallback = false;
    try {
      orders = await prisma.order.findMany({
        where: {
          scheduledAt: {
            gte: startDay,
            lte: endDay,
          },
          status: {
            in: ["ANFRAGE", "ANGEBOT", "BESTAETIGT", "IN_BEARBEITUNG"],
          },
        },
        select: {
          timeSlot: true,
          bookedHours: true,
        },
      });
    } catch {
      fallback = true;
    }

    const blocked: Interval[] = orders
      .map((o) => {
        const parsed = parseSlot(o.timeSlot);
        if (parsed) return parsed;
        if (!o.bookedHours || o.bookedHours <= 0) return null;
        // fallback for legacy records without explicit slot
        return {
          start: work.start,
          end: Math.min(work.end, work.start + Math.floor(o.bookedHours * 60)),
        };
      })
      .filter((x): x is Interval => x !== null)
      .map((x) => ({
        start: Math.max(work.start, x.start - BUFFER_MINUTES),
        end: Math.min(work.end, x.end + BUFFER_MINUTES),
      }));

    const slots = fallback
      ? buildSlots(work, durationMin)
      : buildSlots(work, durationMin).filter((slot) => {
          const candidate = parseSlot(slot.label);
          return candidate ? !blocked.some((b) => intervalsOverlap(candidate, b)) : false;
        });

    return NextResponse.json(
      {
        success: true,
        date: dateStr,
        durationMin,
        slots,
        fullyBooked: slots.length === 0,
        fallback,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=30, s-maxage=60, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    return NextResponse.json(
      { success: false, error: "Verfügbarkeitsabfrage fehlgeschlagen", detail: message },
      { status: 500 }
    );
  }
}
