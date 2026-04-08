import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEFAULT_SLOTS = ["08:00", "10:00", "13:00", "16:00"];

type Interval = {
  start: number;
  end: number;
};

function toMinutes(hhmm: string) {
  const [hours, minutes] = hhmm.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatMinutes(total: number) {
  const hours = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor(total % 60)
    .toString()
    .padStart(2, "0");
  return `${hours}:${minutes}`;
}

function parseSlot(slot: string | null | undefined): Interval | null {
  if (!slot) return null;

  if (/^\d{2}:\d{2}$/.test(slot)) {
    const start = toMinutes(slot);
    return {
      start,
      end: start + 120,
    };
  }

  const [startRaw, endRaw] = slot.split("-");
  if (!startRaw || !endRaw) return null;
  const start = toMinutes(startRaw);
  const end = toMinutes(endRaw);

  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    return null;
  }

  return { start, end };
}

function overlaps(a: Interval, b: Interval) {
  return a.start < b.end && b.start < a.end;
}

function getWorkHours(date: Date) {
  const day = date.getDay();
  if (day === 0) {
    return null;
  }

  if (day === 6) {
    return { start: toMinutes("08:00"), end: toMinutes("16:00") };
  }

  return { start: toMinutes("08:00"), end: toMinutes("18:00") };
}

function buildDefaultSlots(durationMinutes: number, work: Interval) {
  const slotLength = Math.max(120, durationMinutes);

  return DEFAULT_SLOTS.filter((time) => {
    const start = toMinutes(time);
    return start >= work.start && start + 60 <= work.end;
  }).map((time) => {
    const start = toMinutes(time);
    const end = Math.min(work.end, start + slotLength);

    return {
      start: time,
      end: formatMinutes(end),
      label: time,
      available: true,
    };
  });
}

function parseDuration(raw: string | null) {
  const parsed = Number(raw || 0);
  if (!Number.isFinite(parsed) || parsed <= 0) return 120;
  return Math.max(60, Math.floor(parsed));
}

export async function GET(req: NextRequest) {
  try {
    const dateStr = req.nextUrl.searchParams.get("date");
    if (!dateStr) {
      return NextResponse.json({ success: false, error: "date ist erforderlich" }, { status: 400 });
    }

    const selectedDate = new Date(`${dateStr}T00:00:00`);
    if (Number.isNaN(selectedDate.getTime())) {
      return NextResponse.json({ success: false, error: "Ungültiges Datum" }, { status: 400 });
    }

    const work = getWorkHours(selectedDate);
    if (!work) {
      return NextResponse.json({ success: true, date: dateStr, slots: [], fullyBooked: true, fallback: false });
    }

    const durationMin = parseDuration(req.nextUrl.searchParams.get("duration"));
    const startDay = new Date(selectedDate);
    startDay.setHours(0, 0, 0, 0);
    const endDay = new Date(selectedDate);
    endDay.setHours(23, 59, 59, 999);

    let fallback = false;
    let orders: Array<{ timeSlot: string | null }> = [];

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
        },
      });
    } catch {
      fallback = true;
    }

    const candidateSlots = buildDefaultSlots(durationMin, work);

    const slots = candidateSlots.map((slot) => {
      if (fallback) return slot;

      const candidate: Interval = {
        start: toMinutes(slot.start),
        end: toMinutes(slot.end),
      };

      const taken = orders.some((order) => {
        const blocked = parseSlot(order.timeSlot);
        return blocked ? overlaps(candidate, blocked) : false;
      });

      return {
        ...slot,
        available: !taken,
      };
    });

    return NextResponse.json(
      {
        success: true,
        date: dateStr,
        durationMin,
        slots,
        fullyBooked: slots.every((slot) => !slot.available),
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
