export default class InteractiveMap {
    constructor (mapId, onClick) {
        this.mapId = mapId;
        this.onClick = onClick;
    }

    async init() {
        await this.injectYMapsScript();
        await this.loadMaps();
        this.initMap(); 
    }

    
    injectYMapsScript() {
        return new Promise((resolve) => {
            const ymapsScript = document.createElement('script');
            ymapsScript.src = 'https://api-maps.yandex.ru/2.1/?apikey=a120624d-e97a-459d-b98f-94e3806568ae&lang=ru_RU';
            document.body.appendChild(ymapsScript);
            ymapsScript.addEventListener('load', resolve);
        });
    }

    loadMaps() {
        return new Promise((resolve) => ymaps.ready(resolve));
    }

    initMap() {
        this.clusterer = new ymaps.Clusterer({
            groupByCoordinates: true,
            clusterDisableClickZoom: true,
            clusterOpenBaloonInClick: false
        });
        this.clusterer.events.add('click', (e) => {
            const coords = e.get('target').geometry.getCoordinates(); 
            this.onClick(coords);
        });
        this.map = new ymaps.Map(this.mapId, {
            center: [55.75457484, 37.62106303], 
            zoom: 13,
            controls: ['zoomControl']
        });
        this.map.events.add('click', (e) => this.onClick(e.get('coords')));
        this.map.geoObjects.add(this.clusterer);
    }

    openBalloon(coords, content) {
        this.map.balloon.open(coords, content); 
    }

    setBalloonConstent(content) {
        this.map.balloon.setData(content);
    }

    closeBaloon() {
        this.map.balloon.close();
    }

    createPlacemark(coords) {
        const placemark = new ymaps.Placemark(coords); 
        placemark.events.add('click', (e) => {
            const coords = e.get('target').geometry.getCoordinates(); 
            this.onClick(coords); 
        });
        this.clusterer.add(placemark); 
    }
    
    
}



