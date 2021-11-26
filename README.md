!!Update folder structure!!


# Wetterstation

Die ist die Programmausarbeitung zu einer Wetterstation mithilfe eines Raspberrypi's zero W.

Links zur Website:
Mainsite die abrufbar ist um die Daten der letzten 5 Stunden anzuzeigen.
+ [Index - Mainpage](http://raspi-home.ddns.net:8080/)

Die Rohdaten der letzten 5 Stunden, die das frontend der Mainsite nutzt.
+ [Past 5h](http://raspi-home.ddns.net:8080/getdata/)

## Getting Started

Um das Programm zu nutzten, muss es heruntergeladen und konfiguriert werden.<sup>1</sup>

Benötigt werden `python3, flask` packages.
```
git clone git@github.com:Salzsuppe/Wetterstation
cd Wetterstation
nano cfg/config.py
```
Nun die Pin-Numerierung anpassen, gemeint sind Physische Pins.

<kbd>strg+X</kbd>, <kbd>y</kbd>, <kbd>Enter</kbd>
Um die Änderungen unter dem selben Filename zu speichern.

Um Daten von der aktuellen Zeit einzutragen, führen Sie das Programm aus.
```
python3 insertData.py
```

Für automatisch Stündliche Datenaufnahme, kann man z.B. ein Crontab Eintrag erstellen.
`crontab -e`

Nun die Line anhängen:
```
1 * * * * cd /path/to/Wetterstation && python3 /path/to/Wetterstation/getData.py # Ausführung in der ersten Minute jeder Stunde
```



---
<sup>[1]: Git clone wird ohne private Key fehlschlagen, da es nicht public editierbar ist.</sup>


## Struktur
[cfg/](https://github.com/Salzsuppe/Wetterstation/tree/main/cfg) Konfigurations Dateien

[cfg/config.py](https://github.com/Salzsuppe/Wetterstation/tree/main/cfg/config.py) 
+ pinDict enthält die Pin nr. für IN, und wird genutzt in: [declareGPIOstate()](https://github.com/Salzsuppe/Wetterstation/blob/main/measureData.py?plain=1#L25) & [readGPIOValue()](https://github.com/Salzsuppe/Wetterstation/blob/main/measureData.py?plain=1#L35)
+ VPIN enthält die Pin nr. um die Sensorik zu aktivieren, und wird genutzt in: [declareGPIOstate()](https://github.com/Salzsuppe/Wetterstation/blob/main/measureData.py?plain=1#L25) & [readGPIOValue()](https://github.com/Salzsuppe/Wetterstation/blob/main/measureData.py?plain=1#L35)
+ DataEntryList enthält die Dictionary Names, und wird genutzt in: [getDataByVariable()](https://github.com/Salzsuppe/Wetterstation/blob/main/insertData.py?plain=1#L46)

[old/](https://github.com/Salzsuppe/Wetterstation/tree/main/old) enthält alte Version des Codes

[static/](https://github.com/Salzsuppe/Wetterstation/tree/main/static) enthält Grafiken und das JavaScript für das Frontend
+ [Wetterdesign/](https://github.com/Salzsuppe/Wetterstation/tree/main/static/Wetterdesign) enthält die Roh-Grafik
+ [styles/](https://github.com/Salzsuppe/Wetterstation/tree/main/static/styles) enthält die anordnung der Roh-Grafik
+ [main.js](https://github.com/Salzsuppe/Wetterstation/blob/main/static/main.js) das gesamte Frontend script, für Design Anderungen, und die Dateneintragungen

[templates/](https://github.com/Salzsuppe/Wetterstation/tree/main/templates)
+ [index.html](https://github.com/Salzsuppe/Wetterstation/blob/main/templates/index.html) die Vorlage, in welche die Werte eingefüllt werden

[.gitignore](https://github.com/Salzsuppe/Wetterstation/blob/main/.gitignore) Ein Filter um files bei git push zu ignorieren

[README.md](https://github.com/Salzsuppe/Wetterstation/blob/main/README.md) Dieses File

[Raw.db](https://github.com/Salzsuppe/Wetterstation/blob/main/Raw.db) Unsere Database, mit Table RawData, die unsere gemessene und verarbeiteten Werte enthÃ¤lt

[app.py](https://github.com/Salzsuppe/Wetterstation/blob/main/app.py) Unsere Website-Framework wo der Inhalt für die URL's gestellt wird

[asciiflowchart](https://github.com/Salzsuppe/Wetterstation/blob/main/asciiflowchart) Ein Flowchart der Funktionsweise unseres Programmes

[insertData.py](https://github.com/Salzsuppe/Wetterstation/blob/main/insertData.py) Das Programm zur Eintragung der ausgelesenen Werte

[measureData.py](https://github.com/Salzsuppe/Wetterstation/blob/main/measureData.py) Das Programm zu Auslesung der Sensorik



## Funktionsweise


## About

Diese Art von Projekt war für uns alle etwas neues, wir haben uns in der Zeit der ausarbeitung vieles neues angeeignet um ein möglichst gutes Ergebnis zu erziehlen. Dabei sind wir einigen Problemen entgegengetreten welche wir aber glücklicherweise bewältigen konnten.

+ Vorkenntnisse

Natürlich haben wir auch ein paar Vorkenntnisse mitgebracht damit wir so weit kommen konnten bei diesem Projekt.

+ Tom
  + Ich hatte mich voher schon mit Website Design, sprich HTML, CSS, JavaScript beschäftigt
  + Außerdem hatte ich schon Kenntnisse im Bereich Python Programmierung
  + Zuletzt habe ich noch Kenntnisse mit Mikroconrollern mitgebracht

+ Lennart
  + Linux-Enviroment (Filesystem/Console/Software)
  + Networking-Grundlagen (SSH, Sockets, Firewalls, Traffic)
  + Bash-Scripting (Enviroment, Commands, Scripts)

+ Stefan
  +  ...
  +  (Lennart möchte anmerken: Stefan kann googlen)

## Probleme

### Backend - Library
Am Anfang stellte sich die Frage womit man das Backend überhaupt machen soll, C war eine offensichtliche
Möglichkeit da wir mit den Arduinos auch in C programmmieren. Nach ein bisschen stöbern stellte sich heraus,
dass die C Library, die sehr dem Style des Arduinos ähnelt (Digital.write()), nicht länger supported wird.
Nach kürze endschied ich mich dann das ganze Backend in Python3 zu programmieren.
Ich hatte keine Ahnung von Python3, aber auch nicht viel mehr von C außer das was im Unterricht behandelt wurde.

### Backend - Headless Setup/WLAN
Den Raspberrypi aufzusetzen ging schnell vorbei, nach kürze fand ich wie ich mithilfe von wpa_supplicant.conf
eine WLAN configurations aufsetzten kann bevor ich ihn starte. Nun konnte ich mit SSH auf in zugreifen.

Ein Problem was nun auftauchte war das ganze im Schulnetzwerk zu machen. Es hat eine PEAP config was ein bisschen
komplizierter in der configurations Datei ist, ich habe es auf mehrere Weisen versucht, 
unteranderem Netzwerk-Manager aufzusetzen, was alles nicht funktioniert hatte.

Zwischendurch hatten wir einen WLAN router den wir an das LAN Netzwerk angebunden haben, hier konnte ich lokal mit ihm kommunizieren,
aber nicht in das Internet aufgrund Proxy Anmelde-Daten (Diese könnte ich warscheinlich in den Einstellungen aufsetzen).

In Zukunft könnte die lokale Kommunikation ausreichen da ich plane einen Reverse SSH tunnel zu dem Server in der Schule zu machen.
Dies resultiert daran das der SSH port von dem Raspberrypi zu dem Server forwarded wird, und von dort im WWW erreichbar ist.

In der Schule kann ich inzwischen auch mit ihm kommunizieren da man sowohl SSH connections als auch Internet Access über USB-Data port nutzen kann.

### Pins/Sensoren

