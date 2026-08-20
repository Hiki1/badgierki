/* Jedyny plik, ktory edytujesz przed kazdymi gierkami. Zapisz i wypchnij na GitHuba. */
window.GIERKI_CONFIG = {
  wydarzenie: {
    data: '2026-08-25',
    godzinaOd: '18:30',
    godzinaDo: '20:00',
    miejsce: 'Arena Ursynów',
    adres: 'ul. Pileckiego 122, Warszawa',
    mapaUrl: 'https://www.google.com/maps/search/?api=1&query=Arena+Ursyn%C3%B3w+Warszawa'
  },

  // format kortu: 'mixt' / 'debel' (2 nazwiska na polowe) albo 'singiel' (1 nazwisko na polowe)
  korty: [
    { nazwa: 'Kort 1', format: 'mixt', gora: ['Marcin Z', 'Asia'], dol: ['Janek', 'Marysia'] },
    { nazwa: 'Kort 2', format: 'mixt', gora: ['Witek', 'Magda'], dol: ['Mikołaj', 'Monia'] },
    { nazwa: 'Kort 3', format: 'mixt', gora: ['Marti', 'Piotrek'], dol: ['Natalia', 'Czarek'] },
    { nazwa: 'Kort 4', format: 'mixt', gora: ['Ewa'], dol: ['Marcin B'] }
  ],

  rezerwa: [],

  // kwota za korty; zostaw null do czasu gry (ostatnio 151,50 zl za 3 korty)
  kwotaZaKorty: null,

  poprzednie: [
    {
      data: '2026-08-18',
      godzinaOd: '18:30',
      godzinaDo: '20:00',
      miejsce: 'Arena Ursynów',
      kwotaZaKorty: 151.5,
      playlistaUrl: 'https://www.youtube.com/playlist?list=PLbUUETKzic_4',
      korty: [
        { nazwa: 'Kort 1', format: 'mixt', gora: ['Marcin Z', 'Ewa'], dol: ['Wojtek', 'Magda'] },
        { nazwa: 'Kort 2', format: 'mixt', gora: ['Janek', 'Marysia'], dol: ['Marti', 'Piotrek'] },
        { nazwa: 'Kort 3', format: 'mixt', gora: ['Natalia', 'Czarek'], dol: ['Mikołaj', 'Monia'] }
      ]
    }
  ]
};
