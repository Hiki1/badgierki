(function () {
  'use strict';

  var CFG = window.GIERKI_CONFIG;
  var el = {
    blad: document.getElementById('blad'),
    dzien: document.getElementById('hero-dzien'),
    data: document.getElementById('hero-data'),
    godziny: document.getElementById('hero-godziny'),
    odliczanie: document.getElementById('hero-odliczanie'),
    miejsceLink: document.getElementById('hero-miejsce-link'),
    adres: document.getElementById('hero-adres'),
    korty: document.getElementById('korty'),
    rezerwa: document.getElementById('rezerwa'),
    rezerwaLista: document.getElementById('rezerwa-lista'),
    kwota: document.getElementById('kwota'),
    naOsobe: document.getElementById('kwota-na-osobe'),
    stawka: document.getElementById('platnosc-stawka'),
    opisPlatnosci: document.getElementById('platnosc-opis'),
    archiwum: document.getElementById('archiwum'),
    archiwumTytul: document.getElementById('archiwum-tytul'),
    archiwumLista: document.getElementById('archiwum-lista'),
    tplKort: document.getElementById('tpl-kort')
  };

  var pln = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' });

  function pokazBlad(tekst) {
    el.blad.textContent = 'Błąd konfiguracji: ' + tekst + ' Popraw plik gierki-config.js.';
    el.blad.hidden = false;
  }

  function sprawdzKonfiguracje() {
    if (!CFG || !CFG.wydarzenie) {
      pokazBlad('brak obiektu GIERKI_CONFIG lub sekcji "wydarzenie".');
      return false;
    }
    if (!Array.isArray(CFG.korty) || CFG.korty.length === 0) {
      pokazBlad('sekcja "korty" musi być niepustą tablicą.');
      return false;
    }
    return true;
  }

  function dataWydarzenia() {
    return new Date(CFG.wydarzenie.data + 'T00:00:00');
  }

  function roznicaDni(a, b) {
    var doba = 86400000;
    return Math.round((a.setHours(0, 0, 0, 0) - b.setHours(0, 0, 0, 0)) / doba);
  }

  function tekstOdliczania(dni) {
    if (dni === 0) return 'To dzisiaj!';
    if (dni === 1) return 'Jutro';
    if (dni === 2) return 'Pojutrze';
    if (dni > 2) return 'Za ' + dni + ' dni';
    if (dni === -1) return 'Było wczoraj';
    return 'Termin już minął';
  }

  function renderHero() {
    var w = CFG.wydarzenie;
    var d = dataWydarzenia();

    el.dzien.textContent = new Intl.DateTimeFormat('pl-PL', { weekday: 'long' }).format(d);
    el.data.textContent = new Intl.DateTimeFormat('pl-PL', {
      day: 'numeric', month: 'long', year: 'numeric'
    }).format(d);

    el.godziny.textContent = w.godzinaDo ? w.godzinaOd + ' - ' + w.godzinaDo : w.godzinaOd || '';

    var dni = roznicaDni(dataWydarzenia(), new Date());
    el.odliczanie.textContent = tekstOdliczania(dni);
    el.odliczanie.classList.toggle('dzis', dni === 0);

    el.miejsceLink.textContent = w.miejsce || '';
    if (w.mapaUrl) {
      el.miejsceLink.href = w.mapaUrl;
    } else {
      el.miejsceLink.removeAttribute('href');
    }
    el.adres.textContent = w.adres || '';
  }

  function wypelnijPolowe(kontener, nazwiska, miejsca) {
    kontener.innerHTML = '';
    var lista = Array.isArray(nazwiska) ? nazwiska : [];
    for (var i = 0; i < miejsca; i++) {
      var wolne = !lista[i];

      var cwiartka = document.createElement('div');
      cwiartka.className = 'cwiartka' + (wolne ? ' cwiartka--pusta' : '');

      var span = document.createElement('span');
      span.className = 'gracz' + (wolne ? ' gracz--pusty' : '');
      span.textContent = wolne ? 'wolne' : lista[i];

      cwiartka.appendChild(span);
      kontener.appendChild(cwiartka);
    }
  }

  function budujKort(kort) {
    var node = el.tplKort.content.firstElementChild.cloneNode(true);
    var format = kort.format === 'singiel' || kort.format === 'mixt' ? kort.format : 'debel';
    var singiel = format === 'singiel';

    node.classList.add('kort--' + format);
    node.querySelector('.kort-nazwa').textContent = kort.nazwa || '';
    node.querySelector('.kort-format').textContent = format;

    var miejsca = singiel ? 1 : 2;
    wypelnijPolowe(node.querySelector('.polowa--gora'), kort.gora, miejsca);
    wypelnijPolowe(node.querySelector('.polowa--dol'), kort.dol, miejsca);

    return node;
  }

  function renderKorty() {
    el.korty.innerHTML = '';
    CFG.korty.forEach(function (kort) { el.korty.appendChild(budujKort(kort)); });
  }

  function renderRezerwe() {
    var rezerwa = Array.isArray(CFG.rezerwa) ? CFG.rezerwa : [];
    el.rezerwa.hidden = rezerwa.length === 0;
    el.rezerwaLista.innerHTML = '';
    rezerwa.forEach(function (osoba) {
      var li = document.createElement('li');
      li.textContent = osoba;
      el.rezerwaLista.appendChild(li);
    });
  }

  function liczbaGraczy(korty) {
    return (korty || []).reduce(function (suma, kort) {
      return suma + liczOsoby(kort.gora) + liczOsoby(kort.dol);
    }, 0);
  }

  function liczOsoby(lista) {
    if (!Array.isArray(lista)) return 0;
    return lista.filter(function (nazwisko) { return !!nazwisko; }).length;
  }

  function odmianaGraczy(n) {
    if (n === 1) return 'gracz';
    var jednosci = n % 10;
    var dziesiatki = n % 100;
    if (jednosci >= 2 && jednosci <= 4 && (dziesiatki < 12 || dziesiatki > 14)) return 'gracze';
    return 'graczy';
  }

  function przeliczPlatnosc() {
    var kwota = parseFloat(el.kwota.value.replace(/\s/g, '').replace(',', '.'));
    var graczy = liczbaGraczy(CFG.korty);

    el.stawka.textContent = isFinite(kwota) && kwota > 0
      ? pln.format(kwota / CFG.korty.length) + ' za kort'
      : '';

    if (!isFinite(kwota) || kwota <= 0 || graczy === 0) {
      el.naOsobe.textContent = '\u2014';
      el.opisPlatnosci.textContent = graczy
        ? graczy + ' ' + odmianaGraczy(graczy) + ' \u2013 kwota b\u0119dzie znana po grze'
        : '';
      return;
    }

    el.naOsobe.textContent = pln.format(kwota / graczy);
    el.opisPlatnosci.textContent = pln.format(kwota) + ' / ' + graczy + ' ' + odmianaGraczy(graczy);
  }

  function opisTerminu(wyd) {
    var czesci = [new Intl.DateTimeFormat('pl-PL', {
      weekday: 'long', day: 'numeric', month: 'long'
    }).format(new Date(wyd.data + 'T00:00:00'))];

    if (wyd.godzinaOd) {
      czesci.push(wyd.godzinaDo ? wyd.godzinaOd + ' - ' + wyd.godzinaDo : wyd.godzinaOd);
    }
    if (wyd.miejsce) czesci.push(wyd.miejsce);

    return czesci.join(' \u00b7 ');
  }

  function renderArchiwum() {
    var lista = Array.isArray(CFG.poprzednie) ? CFG.poprzednie : [];
    el.archiwum.hidden = lista.length === 0;
    if (lista.length === 0) return;

    el.archiwumTytul.textContent = 'Poprzednie terminy (' + lista.length + ')';
    el.archiwumLista.innerHTML = '';

    lista.forEach(function (wyd) {
      var wpis = document.createElement('article');
      wpis.className = 'archiwum-wpis';

      var naglowek = document.createElement('h3');
      naglowek.className = 'archiwum-data';
      naglowek.textContent = opisTerminu(wyd);
      wpis.appendChild(naglowek);

      var graczy = liczbaGraczy(wyd.korty);
      if (typeof wyd.kwotaZaKorty === 'number' && wyd.kwotaZaKorty > 0 && graczy > 0) {
        var kwota = document.createElement('p');
        kwota.className = 'archiwum-kwota';
        kwota.textContent = pln.format(wyd.kwotaZaKorty) + ' \u00b7 '
          + pln.format(wyd.kwotaZaKorty / graczy) + ' na osob\u0119';
        wpis.appendChild(kwota);
      }

      if (wyd.playlistaUrl) {
        var link = document.createElement('a');
        link.className = 'archiwum-playlista';
        link.href = wyd.playlistaUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Playlista na YouTube';
        wpis.appendChild(link);
      }

      var siatka = document.createElement('div');
      siatka.className = 'korty korty--archiwum';
      (wyd.korty || []).forEach(function (kort) { siatka.appendChild(budujKort(kort)); });
      wpis.appendChild(siatka);

      el.archiwumLista.appendChild(wpis);
    });
  }

  function init() {
    if (!sprawdzKonfiguracje()) return;
    renderHero();
    renderKorty();
    renderRezerwe();
    renderArchiwum();

    if (typeof CFG.kwotaZaKorty === 'number' && CFG.kwotaZaKorty > 0) {
      el.kwota.value = String(CFG.kwotaZaKorty).replace('.', ',');
    }
    el.kwota.addEventListener('input', przeliczPlatnosc);
    przeliczPlatnosc();
  }

  init();
})();
