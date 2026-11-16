// Offizielle Bezeichnungen aus dem KMK-Rahmenlehrplan (Fassung 16.09.2016), Teil V.
export const LEARNING_FIELDS = [
  {id:1,year:1,title:'Das Einzelhandelsunternehmen repräsentieren',short:'Unternehmen & Ausbildung',hint:'Unternehmensformen, Ziele und Berufsausbildung'},
  {id:2,year:1,title:'Verkaufsgespräche kundenorientiert führen',short:'Verkaufsgespräche',hint:'Kundenbedarf, Kommunikation und Argumentation'},
  {id:3,year:1,title:'Kunden im Servicebereich Kasse betreuen',short:'Servicebereich Kasse',hint:'Zahlungsmittel, Kassenablauf und Kassenrechnung'},
  {id:4,year:1,title:'Waren präsentieren',short:'Warenpräsentation',hint:'Warenplatzierung, Orientierung und Gestaltung'},
  {id:5,year:1,title:'Werben und den Verkauf fördern',short:'Werbung & Verkaufsförderung',hint:'Werbeziel, Werbemedien und Aktionen'},
  {id:6,year:2,title:'Waren beschaffen',short:'Beschaffung',hint:'Bedarf, Lieferanten und Bestellungen'},
  {id:7,year:2,title:'Waren annehmen, lagern und pflegen',short:'Lager & Wareneingang',hint:'Wareneingang, Lagerung und Bestandskontrolle'},
  {id:8,year:2,title:'Geschäftsprozesse erfassen und kontrollieren',short:'Geschäftsprozesse',hint:'Belege, Buchungsvorgänge und Kontrolle'},
  {id:9,year:2,title:'Preispolitische Maßnahmen vorbereiten und durchführen',short:'Preispolitik',hint:'Preisgestaltung, Kalkulation und Nachlässe'},
  {id:10,year:2,title:'Besondere Verkaufssituationen bewältigen',short:'Besondere Verkaufssituationen',hint:'Beschwerden, Konflikte und Service'},
  {id:11,year:3,title:'Geschäftsprozesse erfolgsorientiert steuern',short:'Erfolgssteuerung',hint:'Kennzahlen, Umsatz, Kosten und Controlling'},
  {id:12,year:3,title:'Mit Marketingkonzepten Kunden gewinnen und binden',short:'Marketingkonzepte',hint:'Zielgruppen, Marketingmix und Kundenbindung'},
  {id:13,year:3,title:'Personaleinsatz planen und Mitarbeiter führen',short:'Personal & Führung',hint:'Dienstplanung, Kommunikation und Personalentwicklung'},
  {id:14,year:3,title:'Ein Einzelhandelsunternehmen leiten und entwickeln',short:'Unternehmensführung',hint:'Unternehmensplanung, Strategie und Nachhaltigkeit'}
];
export const fieldById = id => LEARNING_FIELDS.find(f=>f.id===Number(id));
export const KMK_SOURCE = 'https://www.kmk.org/fileadmin/Dateien/pdf/Bildung/BeruflicheBildung/rlp/KfmEinzelhandelVerkaeufer04-06-17idF16-09-16-E.pdf';
