export const SEEL_AGB_VERSION = "2026-03";

export const SEEL_CANCELLATION_RULES = [
  { label: "Bis einschliesslich 7 Kalendertage vor dem Termin", fee: "30 %" },
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
      "Diese Allgemeinen Geschaeftsbedingungen gelten fuer alle Vertraege zwischen SEEL Transport & Reinigung, nachfolgend \"Auftragnehmer\", und dem Kunden, nachfolgend \"Auftraggeber\", ueber Transport-, Umzugs-, Reinigungs-, Entsorgungs-, Montage- sowie sonstige begleitende Dienstleistungen.",
      "Abweichende Bedingungen des Auftraggebers werden nur Vertragsbestandteil, wenn SEEL Transport & Reinigung deren Geltung ausdruecklich in Textform bestaetigt.",
    ],
  },
  {
    title: "§ 2 Vertragsschluss und Leistungsumfang",
    paragraphs: [
      "Online-Anfragen, telefonische Abstimmungen und Preisrechner dienen der unverbindlichen Vorbereitung. Ein verbindlicher Vertrag kommt erst zustande, wenn ein Angebot durch SEEL Transport & Reinigung freigegeben und anschliessend vom Auftraggeber bestaetigt oder digital unterzeichnet wird.",
      "Massgeblich fuer Umfang, Preise, Termin, Zusatzleistungen und etwaige Einschraenkungen ist ausschliesslich das zuletzt freigegebene Angebot nebst Vertragsdokument.",
      "SEEL Transport & Reinigung ist berechtigt, qualifizierte Mitarbeiter oder Subunternehmer zur Leistungserbringung einzusetzen.",
    ],
  },
  {
    title: "§ 3 Mitwirkungspflichten des Auftraggebers",
    paragraphs: [
      "Der Auftraggeber stellt sicher, dass Zugangswege, Ladezonen, Parkmoeglichkeiten und Arbeitsbereiche rechtzeitig frei, sicher und tatsaechlich nutzbar sind. Notwendige Genehmigungen, Hausverwaltungsfreigaben oder Halteverbotszonen sind rechtzeitig zu organisieren, sofern nichts anderes schriftlich vereinbart wurde.",
      "Empfindliche, besonders wertvolle oder nicht transportgeeignete Gegenstaende wie Bargeld, Schmuck, Datentraeger, Urkunden oder Kunstgegenstaende sind vom Auftraggeber gesondert zu sichern oder selbst zu transportieren.",
      "Besondere Umstaende wie lange Tragewege, fehlende Aufzuege, sensible Oberflaechen, Reinigungsbesonderheiten, Schaeden am Objekt, schwere Einzelstuecke oder zeitkritische Fenster sind vor Leistungserbringung unaufgefordert mitzuteilen.",
    ],
  },
  {
    title: "§ 4 Termine, Aenderungen und Leistungsdurchfuehrung",
    paragraphs: [
      "Vereinbarte Termine basieren auf den bei Auftragserteilung bekannten Informationen. Kommt es aufgrund unzutreffender Angaben, fehlender Zugangsmoeglichkeit, Witterung, Verkehrsstoerungen, behoerdlicher Anordnungen oder sonstiger Umstaende ausserhalb des Einflussbereichs des Auftragnehmers zu Verzoegerungen, duerfen Ausfuehrungszeiten und Einsatzplanung angemessen angepasst werden.",
      "Zusatzleistungen oder Mehraufwand, die erst vor Ort erkennbar werden oder vom Auftraggeber nachtraeglich angefordert werden, koennen gesondert berechnet werden.",
    ],
  },
  {
    title: "§ 5 Preise und Zahlungsbedingungen",
    paragraphs: [
      "Alle Preise verstehen sich netto zuzueglich der gesetzlich geschuldeten Umsatzsteuer, soweit im Angebot nichts Abweichendes ausgewiesen ist. Fuer Verbraucher ausgewiesene Bruttopreise bleiben hiervon unberuehrt.",
      "Die Verguetung ist nach vollstaendiger Leistungserbringung ohne Abzug faellig, sofern keine andere Zahlungsfrist vereinbart wurde. Zulaessige Zahlungsarten ergeben sich aus Angebot, Rechnung oder gesonderter Abstimmung.",
      "Bei Zahlungsverzug ist SEEL Transport & Reinigung berechtigt, gesetzliche Verzugszinsen sowie weitere Verzugsschaeden geltend zu machen.",
    ],
  },
  {
    title: "§ 6 Stornierung und Ruecktritt",
    paragraphs: [
      "Der Auftraggeber kann den Vertrag vor dem vereinbarten Leistungstermin kuendigen oder vom Vertrag zuruecktreten. In diesem Fall fallen pauschalierte Stornokosten an, es sei denn, der Auftraggeber weist nach, dass ein wesentlich geringerer Schaden entstanden ist.",
      `Es gelten folgende Stornopauschalen: ${SEEL_CANCELLATION_RULES.map((rule) => `${rule.label}: ${rule.fee} der Auftragssumme`).join("; ")}.`,
      "Bereits gesondert veranlasste Dritt- oder Sonderkosten, etwa fuer Halteverbotszonen, Entsorgungsgebuehren, Sonderreinigungsmittel, Parkgenehmigungen oder Fremdleistungen, koennen unabhaengig von den Pauschalen voll weiterberechnet werden, soweit sie tatsaechlich angefallen sind.",
    ],
  },
  {
    title: "§ 7 Haftung",
    paragraphs: [
      "Fuer Umzugs- und Transportleistungen gelten die gesetzlichen Haftungsregelungen, insbesondere die einschlaegigen Vorschriften der §§ 451 ff. HGB, soweit diese anwendbar sind.",
      "Fuer Reinigungs-, Montage-, Entsorgungs- und sonstige Dienstleistungen haftet SEEL Transport & Reinigung im Rahmen der gesetzlichen Vorschriften fuer vorsaetzlich oder fahrlaessig verursachte Schaeden. Keine Haftung besteht fuer bereits vorhandene Schaeden, normale Abnutzung, ungeeignete Materialien, nicht fachgerecht vorbereitete Gegenstaende oder vom Auftraggeber veranlasste Eigenleistungen.",
      "Offensichtliche Maengel oder Schaeden sind unverzueglich, spaetestens innerhalb von 24 Stunden nach Leistungserbringung, in Textform anzuzeigen, damit eine sachgerechte Pruefung und Nachbearbeitung moeglich bleibt.",
    ],
  },
  {
    title: "§ 8 Datenschutz",
    paragraphs: [
      "Personenbezogene Daten werden ausschliesslich zur Vertragsanbahnung, Vertragsdurchfuehrung, Abrechnung, Kundenkommunikation und gesetzlichen Dokumentationspflicht verarbeitet.",
      "Eine Weitergabe an Dritte erfolgt nur, soweit dies fuer die Leistungserbringung erforderlich ist, etwa an eingesetzte Subunternehmer, Zahlungsdienstleister, IT-Dienstleister oder gesetzlich berechtigte Stellen.",
    ],
  },
  {
    title: "§ 9 Schlussbestimmungen",
    paragraphs: [
      "Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der uebrigen Bestimmungen unberuehrt. An die Stelle der unwirksamen Regelung tritt eine rechtlich zulaessige Regelung, die dem wirtschaftlichen Zweck am naechsten kommt.",
      "Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist, soweit gesetzlich zulaessig, Berlin.",
      "Aenderungen, Ergaenzungen und Nebenabreden beduerfen mindestens der Textform.",
    ],
  },
];

export const SEEL_CONTRACT_HIGHLIGHTS = [
  "Der Auftrag wird auf Basis des freigegebenen Angebots sowie dieser AGB ausgefuehrt.",
  "Zusatzleistungen, Wartezeiten und dokumentierter Mehraufwand koennen nachberechnet werden.",
  `Stornierung: ${SEEL_CANCELLATION_RULES.map((rule) => `${rule.fee} (${rule.label})`).join(", ")}.`,
  "Es gilt deutsches Recht. Gerichtsstand ist Berlin, soweit gesetzlich zulaessig.",
] as const;

export function getSeelAgbPlainText(): string[] {
  return SEEL_AGB_SECTIONS.flatMap((section) => [section.title, ...section.paragraphs]);
}
