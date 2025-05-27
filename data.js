const imageURLs = [
  "https://www.spp.gov.cn/tt/202309/627749/images/d70240dffe294da48878075dea805f10.jpg",
  "https://p1.img.cctvpic.com/20121116/images/1353032545840_1353032545840_r.jpg",
  "https://img0.baidu.com/it/u=1751874762,174801734&fm=253&fmt=auto&app=138&f=JPEG?w=569&h=441",
  "https://img2.baidu.com/it/u=4105789072,2126791779&fm=253&fmt=auto&app=138&f=JPEG?w=592&h=500",
  "https://img0.baidu.com/it/u=1074066415,3646305929&fm=253&fmt=auto&app=138&f=JPEG?w=570&h=436",
  "https://img1.baidu.com/it/u=2229305067,530222792&fm=253&fmt=auto&app=138&f=JPEG?w=619&h=455",
  "https://img0.baidu.com/it/u=3045807454,132065695&fm=253&fmt=auto&app=138&f=JPEG?w=726&h=500",
  "https://img0.baidu.com/it/u=1770571356,2969836617&fm=253&fmt=auto&app=138&f=JPEG?w=522&h=371",
];
let imageIndex = 0;

function getNextImageURL() {
  const url = imageURLs[imageIndex];
  imageIndex = (imageIndex + 1) % imageURLs.length;
  return url;
}
