import * as olProj from 'ol/proj'
import Overlay from 'ol/Overlay'
import './typhoon.css'

export default (_this, id, data) => {
  let map = _this.MapTable.map
  let point = olProj.transform(
    [JSON.parse(data[0].points[0].lng), JSON.parse(data[0].points[0].lat)],
    'EPSG:4326',
    'EPSG:3857'
  )
  let tyTipElement = document.createElement('div')
  tyTipElement.className = 'tyToolTip'
  _this.tyOverlay[id] = new Overlay({
    element: tyTipElement,
    offset: [10, 0],
    positioning: 'center-left'
  })
  map.addOverlay(_this.tyOverlay[id])
  tyTipElement.innerHTML = id + data[0].name
  _this.tyOverlay[id].setPosition(point)
}
