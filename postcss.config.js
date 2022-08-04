module.exports = {
  plugins: {
    "autoprefixer": {},
    "postcss-pxtorem": {
      rootValue: 37.5, // 根据设计图尺寸比例设置
      propList: ['*'], // 需要被转换的属性
      selectorBlackList: [] // 不进行px转换的选择器
    }
  }
}