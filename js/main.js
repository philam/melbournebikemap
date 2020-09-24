import 'ol/ol.css';
import Layer from 'ol/layer/Layer';
import Map from 'ol/Map';
import View from 'ol/View';
import {composeCssTransform} from 'ol/transform';

var map = new Map({
  target: 'map',
  view: new View({
    center: [0, 0],
    extent: [-180, -90, 180, 90],
    projection: 'EPSG:4326',
    zoom: 2,
  }),
});

var svgContainer = document.createElement('div');
var xhr = new XMLHttpRequest();
xhr.open('GET', './assets/svg/bikemapv1.1.svg');
xhr.addEventListener('load', function () {
  var svg = xhr.responseXML.documentElement;
  svgContainer.ownerDocument.importNode(svg);
  svgContainer.appendChild(svg);
});
xhr.send();

var width = 2560;
var height = 1280;
var svgResolution = 360 / width;
svgContainer.style.width = width + 'px';
svgContainer.style.height = height + 'px';
svgContainer.style.transformOrigin = 'top left';
svgContainer.className = 'svg-layer';

map.addLayer(
  new Layer({
    render: function (frameState) {
      var scale = svgResolution / frameState.viewState.resolution;
      var center = frameState.viewState.center;
      var size = frameState.size;
      var cssTransform = composeCssTransform(
        size[0] / 2,
        size[1] / 2,
        scale,
        scale,
        frameState.viewState.rotation,
        -center[0] / svgResolution - width / 2,
        center[1] / svgResolution - height / 2
      );
      svgContainer.style.transform = cssTransform;
      svgContainer.style.opacity = this.getOpacity();
      return svgContainer;
    },
  })
);