# Badgierki

Statyczna strona z rozpiska gierek badmintonowych: wyrozniony termin i miejsce oraz graficzne korty.

## Jak zaktualizowac rozpiske

Edytujesz wylacznie `gierki-config.js`, zapisujesz i wypychasz zmiany na GitHuba.

```js
window.GIERKI_CONFIG = {
  wydarzenie: {
    data: '2026-08-25',      // format RRRR-MM-DD
    godzinaOd: '18:30',
    godzinaDo: '20:00',
    miejsce: 'Arena Ursynów',
    adres: 'ul. Pileckiego 122, Warszawa',
    mapaUrl: 'https://...'   // opcjonalny link do mapy
  },
  korty: [
    { nazwa: 'Kort 1', format: 'mixt',    gora: ['Marcin Z', 'Asia'], dol: ['Janek', 'Marysia'] },
    { nazwa: 'Kort 2', format: 'debel',   gora: ['Ewa', 'Darek'],     dol: ['Mirka', 'Marcin B'] },
    { nazwa: 'Kort 3', format: 'singiel', gora: ['Natalia'],          dol: ['Czarek'] }
  ],
  rezerwa: [],            // osoby pauzujace, pusta lista ukrywa sekcje
  kwotaZaKorty: null      // null = pole puste (kwota znana dopiero po grze)
};
```

Zasady:

- `format: 'mixt'` i `format: 'debel'` oczekuja 2 nazwisk na polowe, `format: 'singiel'` - 1.
- Kortow moze byc dowolna liczba, siatka sama sie ulozy.
- Brakujace nazwisko wyswietli sie jako "wolne", a cwiartka kortu zostanie podswietlona
  na pomaranczowo.
- Pusta lub pominieta `rezerwa` ukrywa sekcje "Pauzuja".

## Platnosc

Boks "Platnosc" dzieli wpisana kwote przez liczbe graczy rozstawionych na kortach.
Kwote mozna wpisac z przecinkiem lub kropka. Dodatkowo pokazywana jest stawka za jeden kort.

Pole startuje z wartoscia `kwotaZaKorty` z konfiguracji. Zostaw `null`, dopoki kwota nie jest
znana - wtedy widoczny jest tylko placeholder i informacja "kwota bedzie znana po grze".
Po grze wpisz kwote do `kwotaZaKorty` i wypchnij zmiane, zeby wszyscy widzieli to samo.

## Poprzednie terminy

Rozegrane juz gierki przenies do tablicy `poprzednie` - kazdy wpis to `data`, `godzinaOd`,
`godzinaDo`, `miejsce`, opcjonalna `kwotaZaKorty`, opcjonalny `playlistaUrl` i wlasna lista
`korty`. Sekcja jest zwinieta i pokazuje liczbe wpisow; przy kazdym terminie wyswietla sie
zaplacona kwota, wyliczona kwota na osobe i link do playlisty z nagraniami.

```js
  poprzednie: [
    {
      data: '2026-08-18',
      godzinaOd: '18:30',
      godzinaDo: '20:00',
      miejsce: 'Arena Ursynów',
      kwotaZaKorty: 151.5,
      playlistaUrl: 'https://www.youtube.com/playlist?list=...',
      korty: [
        { nazwa: 'Kort 1', format: 'mixt', gora: ['Marcin Z', 'Ewa'], dol: ['Wojtek', 'Magda'] }
      ]
    }
  ]
```

## Uruchomienie lokalne

Brak zaleznosci i kroku budowania - wystarczy otworzyc `index.html` w przegladarce.

## Publikacja na GitHub Pages

Wypchnij zawartosc folderu do repozytorium, a nastepnie w ustawieniach repo:
**Settings -> Pages -> Source: Deploy from a branch -> Branch: `main` / `/ (root)`**.
