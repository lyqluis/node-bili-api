// 分区 id
// 参考：https://socialsisteryi.github.io/bilibili-API-collect/docs/video/video_zone.html#%E5%8A%A8%E7%94%BB
const REGIONS = [
  {
    title: '动画', name: 'donghua', rid: 1, children: [
      { title: 'MAD·AMV', name: 'mad', rid: 24, },
      { title: 'MMD·3D', name: 'mmd', rid: 25, },
      { title: '短片·手书·配音', name: 'voice', rid: 47, },
      { title: '手办·模玩', name: 'garage_kit', rid: 210, },
      { title: '特摄', name: 'tokusatsu', rid: 86, },
      { title: '动漫杂谈', name: 'acgntalks', rid: 253, },
      { title: '综合', name: 'other', rid: 27, },
    ]
  },
  {
    title: '番剧', name: 'anime', rid: 13, children: [
      { title: '资讯', name: 'information', rid: 51, },
      { title: '官方延伸', name: 'offical', rid: 152, },
      { title: '完结动画', name: 'finish', rid: 32, },
      { title: '连载动画', name: 'serial', rid: 33, },
    ]
  },
  {
    title: '国创', name: 'guochuang', rid: 167, children: [
      { title: '国产动画', name: 'chinese', rid: 153 },
      { title: '国产原创相关', name: 'original', rid: 168 },
      { title: '布袋戏', name: 'puppetry', rid: 169 },
      { title: '资讯', name: 'information', rid: 170 },
      { title: '动态漫·广播剧', name: 'motioncomic', rid: 195 },
    ]
  },
  {
    title: '音乐', name: 'music', rid: 3, children: [
      { title: '原创音乐', name: 'original', rid: 28 },
      { title: '翻唱', name: 'cover', rid: 31 },
      { title: 'VOCALOID·UTAU', name: 'vocaloid', rid: 30 },
      { title: '演奏', name: 'perform', rid: 59 },
      { title: 'MV', name: 'mv', rid: 193 },
      { title: '音乐现场', name: 'live', rid: 29 },
      { title: '音乐综合', name: 'other', rid: 130 },
      { title: '乐评盘点', name: 'commentary', rid: 243 },
      { title: '音乐教学', name: 'tutorial', rid: 244 },
    ]
  },
  {
    title: '舞蹈', name: 'dance', rid: 129, children: [
      { title: '宅舞', name: 'otaku', rid: 20 },
      { title: '舞蹈综合', name: 'three_d', rid: 154 },
      { title: '舞蹈教程', name: 'demo', rid: 156 },
      { title: '街舞', name: 'hiphop', rid: 198 },
      { title: '明星舞蹈', name: 'star', rid: 199 },
      { title: '中国舞', name: 'china', rid: 200 },
    ]
  },
  {
    title: '游戏', name: 'game', rid: 4, children: [
      { title: '单机游戏', name: 'stand_alone', rid: 17 },
      { title: '电子竞技', name: 'esports', rid: 171 },
      { title: '手机游戏', name: 'mobile', rid: 172 },
      { title: '网络游戏', name: 'online', rid: 65 },
      { title: '桌游棋牌', name: 'board', rid: 173 },
      { title: 'GMV', name: 'gmv', rid: 121 },
      { title: '音游', name: 'music', rid: 136 },
      { title: 'Mugen', name: 'mugen', rid: 19 },
    ]
  },
  {
    title: '知识', name: 'knowledge', rid: 36, children: [
      { title: '科学科普', name: 'science', rid: 201 },
      { title: '社科·法律·心理', name: 'social_science', rid: 124 },
      { title: '人文历史', name: 'humanity_history', rid: 228 },
      { title: '财经商业', name: 'business', rid: 207 },
      { title: '校园学习', name: 'campus', rid: 208 },
      { title: '职业职场', name: 'career', rid: 209 },
      { title: '设计·创意', name: 'design', rid: 229 },
      { title: '野生技术协会', name: 'skill', rid: 122 },
    ]
  },
  {
    title: '科技', name: 'tech', rid: 188, children: [
      { title: '数码', name: 'digital', rid: 95 },
      { title: '软件应用', name: 'application', rid: 230 },
      { title: '计算机技术', name: 'computer_tech', rid: 231 },
      { title: '科工机械', name: 'industry', rid: 232 },
      { title: '极客 DIY', name: 'diy', rid: 233 },
    ]
  },
  {
    title: '运动', name: 'sports', rid: 234, children: [
      { title: '篮球', name: 'basketball', rid: 235 },
      { title: '足球', name: 'football', rid: 249 },
      { title: '健身', name: 'aerobics', rid: 164 },
      { title: '竞技体育', name: 'athletic', rid: 236 },
      { title: '运动文化', name: 'culture', rid: 237 },
      { title: '运动综合', name: 'comprehensive', rid: 238 },
    ]
  },
  {
    title: '汽车', name: 'car', rid: 223, children: [
      { title: '赛车', name: 'racing', rid: 245 },
      { title: '改装玩车', name: 'modifiedvehicle', rid: 246 },
      { title: '新能源车', name: 'newenergyvehicle', rid: 247 },
      { title: '房车', name: 'touringcar', rid: 248 },
      { title: '摩托车', name: 'motorcycle', rid: 240 },
      { title: '购车攻略', name: 'strategy', rid: 227 },
      { title: '汽车生活', name: 'life', rid: 176 },
    ]
  },
  {
    title: '生活', name: 'life', rid: 160, children: [
      { title: '搞笑', name: 'funny', rid: 138 },
      { title: '出行', name: 'travel', rid: 250 },
      { title: '三农', name: 'rurallife', rid: 251 },
      { title: '家居房产', name: 'home', rid: 239 },
      { title: '手工', name: 'handmake', rid: 161 },
      { title: '绘画', name: 'painting', rid: 162 },
      { title: '日常', name: 'daily', rid: 21 },
    ]
  },
  {
    title: '美食', name: 'food', rid: 211, children: [
      { title: '美食制作', name: 'make', rid: 76 },
      { title: '美食侦探', name: 'detective', rid: 212 },
      { title: '美食测评', name: 'measurement', rid: 213 },
      { title: '田园美食', name: 'rural', rid: 214 },
      { title: '美食记录', name: 'record', rid: 215 },
    ]
  },
  {
    title: '动物', name: 'animal', rid: 217, children: [
      { title: '喵星人', name: 'cat', rid: 218 },
      { title: '汪星人', name: 'dog', rid: 219 },
      { title: '大熊猫', name: 'panda', rid: 220 },
      { title: '野生动物', name: 'wild_animal', rid: 221 },
      { title: '爬宠', name: 'reptiles', rid: 222 },
      { title: '动物综合', name: 'animal_composite', rid: 75 },
    ]
  },
  {
    title: '鬼畜', name: 'kichiku', rid: 119, children: [
      { title: '鬼畜调教', name: 'guide', rid: 22 },
      { title: '音 MAD', name: 'mad', rid: 26 },
      { title: '人力 VOCALOID', name: 'manual_vocaloid', rid: 126 },
      { title: '鬼畜剧场', name: 'theatre', rid: 216 },
      { title: '教程演示', name: 'course', rid: 127 },
    ]
  },
  {
    title: '时尚', name: 'fashion', rid: 155, children: [
      { title: '美妆护肤', name: 'makeup', rid: 157 },
      { title: '仿妆 cos', name: 'cos', rid: 252 },
      { title: '穿搭', name: 'clothing', rid: 158 },
      { title: '时尚潮流', name: 'catwalk', rid: 159 },
    ]
  },
  {
    title: '资讯', name: 'information', rid: 202, children: [
      { title: '热点', name: 'hotspot', rid: 203 },
      { title: '环球', name: 'global', rid: 204 },
      { title: '社会', name: 'social', rid: 205 },
      { title: '综合', name: 'multiple', rid: 206 },
    ]
  },
  {
    title: '娱乐', name: 'ent', rid: 5, children: [
      { title: '综艺', name: 'variety', rid: 71 },
      { title: '娱乐杂谈', name: 'talker', rid: 241 },
      { title: '粉丝创作', name: 'fans', rid: 242 },
      { title: '明星综合', name: 'celebrity', rid: 137 },
    ]
  },
  {
    title: '影视', name: 'cinephile', rid: 181, children: [
      { title: '影视杂谈', name: 'cinecism', rid: 182 },
      { title: '影视剪辑', name: 'montage', rid: 183 },
      { title: '小剧场', name: 'shortfilm', rid: 85 },
      { title: '预告·资讯', name: 'trailer_info', rid: 184 },
    ]
  },
  {
    title: '纪录片', name: 'documentary', rid: 177, children: [
      { title: '人文·历史', name: 'history', rid: 37 },
      { title: '科学·探索·自然', name: 'science', rid: 178 },
      { title: '军事', name: 'military', rid: 179 },
      { title: '社会·美食·旅行', name: 'travel', rid: 180 },
    ]
  },
  {
    title: '电影', name: 'movie', rid: 23, children: [
      { title: '华语电影', name: 'chinese', rid: 147 },
      { title: '欧美电影', name: 'west', rid: 145 },
      { title: '日本电影', name: 'japan', rid: 146 },
      { title: '其他国家', name: 'movie', rid: 83 },
    ]
  },
  {
    title: '电视剧', name: 'tv', rid: 11, children: [
      { title: '国产剧', name: 'mainland', rid: 185 },
      { title: '海外剧', name: 'overseas', rid: 187 },
    ]
  },
]
  .map(item => {
    item.children.unshift({ title: '全部', name: item.name, rid: item.rid })
    return item
  })

const RANK_EXCLUDES = ['anime', 'information']
const RANK_REGIONS = REGIONS.map(item => {
  if (item.name === 'guochuang') {
    return { ...item, children: null, rid: 168 }
  }
  return { ...item, children: null }
}).filter(item => !RANK_EXCLUDES.includes(item.name))

module.exports = { REGIONS, RANK_REGIONS }