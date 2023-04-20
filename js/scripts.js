mapboxgl.accessToken = 'pk.eyJ1IjoieW9vdXplZSIsImEiOiJjbGc1cWoweWkwNjAwM2Vwbzc1cGVyNmxsIn0.dgHHzAHSakJWLbVW4jFoHQ';

const map = new mapboxgl.Map({
    container: "map", // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: "mapbox://styles/mapbox/streets-v12", // style URL
    center: [-96.6, 37.75], // starting position [lng, lat]
    zoom: 4.2, // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());

map.on('load', function () {

    // import our election data that we converted to wgs84 in QGIS
    map.addSource('election-county', {
        type: 'geojson',
        data: './data/county_level_presidential_results.geojson'
    })

    map.addLayer({
        id: 'fill-election-county',
        type: 'fill',
        source: 'election-county',
        paint: {
            'fill-color': [
                'case',
                ['<=', ['get', 'Final_2004_D_votepct'], 0.20], '#accbff', // lightest blue
                ['<=', ['get', 'Final_2004_D_votepct'], 0.40], '#92bbff', // light blue
                ['<=', ['get', 'Final_2004_D_votepct'], 0.60], '#78aaff', // medium blue
                ['<=', ['get', 'Final_2004_D_votepct'], 0.80], '#649eff', // dark blue
                '#4188ff' // darkest blue
            ]
        }
    });


    function updateMap(year) {
        console.log(`Updating map for year ${year}...`);
        map.setPaintProperty('fill-election-county', 'fill-color', [
            'case',
            ['has', `Final_${year}_D_votepct`],
            ['case',
                ['<=', ['get', `Final_${year}_D_votepct`], 0.20], '#accbff', // lightest blue
                ['<=', ['get', `Final_${year}_D_votepct`], 0.40], '#92bbff', // light blue
                ['<=', ['get', `Final_${year}_D_votepct`], 0.60], '#78aaff', // medium blue
                ['<=', ['get', `Final_${year}_D_votepct`], 0.80], '#649eff', // dark blue
                '#4188ff', // darkest blue
            ],
            '#cccccc' // default color
        ]);
        console.log('Map updated!');
    }

    updateMap(2004)

    map.addLayer({
        id: 'county-outline',
        type: 'line',
        source: 'election-county',
        paint: {
            'line-color': '#000000',
            'line-opacity': 0.2,
            'line-width': 1
        }
    });

    map.on('click', 'fill-election-county', (e) => {
        console.log('foo', e.features)


        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(e.features[0].properties.NAMELSAD)
            .addTo(map);
    });


    // add event listeners to the year buttons
    const yearButtons = document.querySelectorAll('#sidebar button')
    yearButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const year = e.target.id.split('-')[1]
            updateMap(year)
        })
    })

    // demonstrate the layers that are already on the map
    console.log(map.getStyle().layers)

})
