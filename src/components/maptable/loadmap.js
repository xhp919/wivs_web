import Map from 'ol/Map'
import View from 'ol/View'
import * as olControl from 'ol/control'
import * as olInteraction from 'ol/interaction'

export default (el, viewOpt, controlsOpt, interactionsOpt) => {
  let map = new Map({
    target: el,
    layers: [],
    interactions: olInteraction.defaults(interactionsOpt),
    view: new View(viewOpt),
    controls: olControl.defaults(controlsOpt)
  })
  return map
}
