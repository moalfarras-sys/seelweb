export const SEEL_AGB_VERSION = "2026-03";

export const SEEL_CANCELLATION_RULES = [
  { label: "Bis einschließlich 7 Kalendertage vor dem Termin", fee: "30 %" },
  { label: "6 bis 3 Kalendertage vor dem Termin", fee: "50 %" },
  { label: "2 Kalendertage vor dem Termin", fee: "80 %" },
  { label: "Am Leistungstag oder bei Nichterscheinen", fee: "100 %" },
] as const;

export type LegalSection = {
  title: string;
  paragraphs: string[];
};

export const SEEL_AGB_SECTIONS: LegalSection[] = [
  {
    title: "§ 1 Geltungsbereich",
    paragraphs: [
      "Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge zwischen SEEL Transport & Reinigung, nachfolgend \"Auftragnehmer\", und dem Kunden, nachfolgend \"Auftraggeber\", über Transport-, Umzugs-, Reinigungs-, Entsorgungs-, Montage- sowie sonstige begleitende Dienstleistungen.",
      "Abweichende Bedingungen des Auftraggebers werden nur Vertragsbestandteil, wenn SEEL Transport & Reinigung deren Geltung ausdrücklich in Textform bestätigt.",
    ],
  },
  {
    title: "§ 2 Vertragsschluss und Leistungsumfang",
    paragraphs: [
      "Online-Anfragen, telefonische Abstimmungen und Preisrechner dienen der unverbindlichen Vorbereitung. Ein verbindlicher Vertrag kommt erst zustande, wenn ein Angebot durch SEEL Transport & Reinigung freigegeben und anschließend vom Auftraggeber bestätigt oder digital unterzeichnet wird.",
      "Maßgeblich für Umfang, Preise, Termin, Zusatzleistungen und etwaige Einschränkungen ist ausschließlich das zuletzt freigegebene Angebot nebst Vertragsdokument.",
      "SEEL Transport & Reinigung ist berechtigt, qualifizierte Mitarbeiter oder Subunternehmer zur Leistungserbringung einzusetzen.",
    ],
  },
  {
    title: "§ 3 Mitwirkungspflichten des Auftraggebers",
    paragraphs: [
      "Der Auftraggeber stellt sicher, dass Zugangswege, Ladezonen, Parkmöglichkeiten und Arbeitsbereiche rechtzeitig frei, sicher und tatsächlich nutzbar sind. Notwendige Genehmigungen, Hausverwaltungsfreigaben oder Halteverbotszonen sind rechtzeitig zu organisieren, sofern nichts anderes schriftlich vereinbart wurde.",
      "Empfindliche, besonders wertvolle oder nicht transportgeeignete Gegenstände wie Bargeld, Schmuck, Datenträger, Urkunden oder Kunstgegenstände sind vom Auftraggeber gesondert zu sichern oder selbst zu transportieren.",
      "Besondere Umstände wie lange Tragewege, fehlende Aufzüge, sensible Oberflächen, Reinigungsbesonderheiten, Schäden am Objekt, schwere Einzelstücke oder zeitkritische Fenster sind vor Leistungserbringung unaufgefordert mitzuteilen.",
    ],
  },
  {
    title: "§ 4 Termine, Änderungen und Leistungsdurchführung",
    paragraphs: [
      "Vereinbarte Termine basieren auf den bei Auftragserteilung bekannten Informationen. Kommt es aufgrund unzutreffender Angaben, fehlender Zugangsmöglichkeit, Witterung, Verkehrs­störungen, behördlicher Anordnungen oder sonstiger Umstände außerhalb des Einflussbereichs des Auftragnehmers zu Verzögerungen, dürfen Ausführungszeiten und Einsatzplanung angemessen angepasst werden.",
      "Zusatzleistungen oder Mehraufwand, die erst vor Ort erkennbar werden oder vom Auftraggeber nachträglich angefordert werden, können gesondert berechnet werden.",
    ],
  },
  {
    title: "§ 5 Preise und Zahlungsbedingungen",
    paragraphs: [
      "Alle Preise verstehen sich netto zuzüglich der gesetzlich geschuldeten Umsatzsteuer, soweit im Angebot nichts Abweichendes ausgewiesen ist. Für Verbraucher ausgewiesene Bruttopreise bleiben hiervon unberührt.",
      "Die Vergütung ist nach vollständiger Leistungserbringung ohne Abzug fällig, sofern keine andere Zahlungsfrist vereinbart wurde. Zulässige Zahlungsarten ergeben sich aus Angebot, Rechnung oder gesonderter Abstimmung.",
      "Bei Zahlungsverzug ist SEEL Transport & Reinigung berechtigt, gesetzliche Verzugszinsen sowie weitere Verzugsschäden geltend zu machen.",
    ],
  },
  {
    title: "§ 6 Stornierung und Rücktritt",
    paragraphs: [
      "Der Auftraggeber kann den Vertrag vor dem vereinbarten Leistungstermin kündigen oder vom Vertrag zurücktreten. In diesem Fall fallen pauschalierte Stornokosten an, es sei denn, der Auftraggeber weist nach, dass ein wesentlich geringerer Schaden entstanden ist.",
      `Es gelten folgende Stornopauschalen: ${SEEL_CANCELLATION_RULES.map((rule) => `${rule.label}: ${rule.fee} der Auftragssumme`).join("; ")}.`,
      "Bereits gesondert veranlasste Dritt- oder Sonderkosten, etwa für Halteverbotszonen, Entsorgungsgebühren, Sonderreinigungsmittel, Parkgenehmigungen oder Fremdleistungen, können unabhängig von den Pauschalen voll weiterberechnet werden, soweit sie tatsächlich angefallen sind.",
    ],
  },
  {
    title: "§ 7 Haftung",
    paragraphs: [
      "Für Umzugs- und Transportleistungen gelten die gesetzlichen Haftungsregelungen, insbesondere die einschlägigen Vorschriften der §§ 451 ff. HGB, soweit diese anwendbar sind.",
      "Für Reinigungs-, Montage-, Entsorgungs- und sonstige Dienstleistungen haftet SEEL Transport & Reinigung im Rahmen der gesetzlichen Vorschriften für vorsätzlich oder fahrlässig verursachte Schäden. Keine Haftung besteht für bereits vorhandene Schäden, normale Abnutzung, ungeeignete Materialien, nicht fachgerecht vorbereitete Gegenstände oder vom Auftraggeber veranlasste Eigenleistungen.",
      "Offensichtliche Mängel oder Schäden sind unverzüglich, spätestens innerhalb von 24 Stunden nach Leistungserbringung, in Textform anzuzeigen, damit eine sachgerechte Prüfung und Nachbearbeitung möglich bleibt.",
    ],
  },
  {
    title: "§ 8 Datenschutz",
    paragraphs: [
      "Personenbezogene Daten werden ausschließlich zur Vertragsanbahnung, Vertragsdurchführung, Abrechnung, Kundenkommunikation und gesetzlichen Dokumentationspflicht verarbeitet.",
      "Eine Weitergabe an Dritte erfolgt nur, soweit dies für die Leistungserbringung erforderlich ist, etwa an eingesetzte Subunternehmer, Zahlungsdienstleister, IT-Dienstleister oder gesetzlich berechtigte Stellen.",
    ],
  },
  {
    title: "§ 9 Schlussbestimmungen",
    paragraphs: [
      "Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt. An die Stelle der unwirksamen Regelung tritt eine rechtlich zulässige Regelung, die dem wirtschaftlichen Zweck am nächsten kommt.",
      "Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist, soweit gesetzlich zulässig, Berlin.",
      "Änderungen, Ergänzungen und Nebenabreden bedürfen mindestens der Textform.",
    ],
  },
];

export const SEEL_CONTRACT_HIGHLIGHTS = [
  "Der Auftrag wird auf Basis des freigegebenen Angebots sowie dieser AGB ausgeführt.",
  "Zusatzleistungen, Wartezeiten und dokumentierter Mehraufwand können nachberechnet werden.",
  `Stornierung: ${SEEL_CANCELLATION_RULES.map((rule) => `${rule.fee} (${rule.label})`).join(", ")}.`,
  "Es gilt deutsches Recht. Gerichtsstand ist Berlin, soweit gesetzlich zulässig.",
] as const;

export function getSeelAgbPlainText(): string[] {
  return SEEL_AGB_SECTIONS.flatMap((section) => [section.title, ...section.paragraphs]);
}
