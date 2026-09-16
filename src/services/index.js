export const HomeConfig = {
  noticeContent: `【委託須知與流程說明】
  /注意事項/
委託成立時即認定 委託人已成年 或 未成年但經監護人同意此委託交易之行為
未成年不可委託R18圖
會確實告知完成時間，若有延誤必提前通知
委託圖非買斷，不可二次修改、印製商品或有其他營利行為
自印收藏或親友贈送等需先告知與討論
價格會因人設、構圖等之複雜度去做調整
會於社群公開發布加浮水印之委託圖
匯款帳戶僅提供玉山、郵局
此網站皆為非商業委託價格，商業委託麻煩以信箱聯繫
未列在以上之事宜，歡迎私訊詢問

/委託流程/
填寫委託表單
(限定開放時間)
▼
私訊了解需求與報價
▼
支付半款/全款(3日內)
(驚喜包需付全款)
▼
確認草稿(可修改2次)
▼
確認線稿與底色(可修改1次)
▼
支付剩餘款項(3日內)
▼
確認完稿
(完稿僅能修改小細節或與委託設定不符之錯誤！)`,

  typesInfo: {
    1: {
      description: `半身｜NT$ 2000 up / 人
      全身｜NT$ 2500 up / 人


      ※雙人價格x2，三人以上另議`, basePrice: '2000'
    },
    2: {
      description: `半身｜NT$ 3300 up
      全身｜NT$ 4000 up

      ※注意：塗鴉有機率簡化服裝、配件及飾品等，若希望保留請加註提醒！`, basePrice: '3300'
    },
    3: {
      description: `NT$ 4000 up


      ※注意：塗鴉有機率簡化服裝、配件及飾品等，若希望保留請加註提醒！`, basePrice: '4000'
    },
    4: {
      description: `3個互動｜NT$ 5000 up


      ※注意：塗鴉有機率簡化服裝、配件及飾品等，若希望保留請加註提醒！`, basePrice: '5000'
    },
  }
}


export const getHomeConfig = () => {
  const saved = localStorage.getItem('HomeConfig')
  return saved ? JSON.parse(saved) : HomeConfig
}

export const saveHomeConfig = (config) => {
  localStorage.setItem('HomeConfig',JSON.stringify(config))
}







