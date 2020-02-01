export default (_this, id) => {
  let typhoonLayer = _this.MapTable.layers.typhoonLayer
  if (typhoonLayer.getSource().getFeatureById('typhoon:' + id + ':radius:7')) {
    typhoonLayer.getSource().removeFeature(
      typhoonLayer.getSource().getFeatureById('typhoon:' + id + ':radius:7')
    )
  }
  if (typhoonLayer.getSource().getFeatureById('typhoon:' + id + ':radius:10')) {
    typhoonLayer.getSource().removeFeature(
      typhoonLayer.getSource().getFeatureById('typhoon:' + id + ':radius:10')
    )
  }
  if (typhoonLayer.getSource().getFeatureById('typhoon:' + id + ':radius:12')) {
    typhoonLayer.getSource().removeFeature(
      typhoonLayer.getSource().getFeatureById('typhoon:' + id + ':radius:12')
    )
  }
}
