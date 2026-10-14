# Skeleton Playground · Nickson 的骨頭人遊樂場

給接近 4 歲、喜歡萬聖節骨頭人的孩子玩的小遊戲。獨立於 japanese-game，沒有單字題目、倒數、失敗懲罰、帳號、廣告或追蹤。

## 五種自由玩法

- 骨頭人跳舞：扭扭舞、機器舞與搖滾舞，可播放或休息。
- 南瓜保齡球：選方向後點南瓜，或用 Pointer Events 把南瓜往前推；倒下後隨時再玩。
- 幽靈泡泡：點破泡泡，泡泡會再長回來。
- 骨頭人變裝：帽子、眼鏡與骨頭顏色；造型保存在裝置上，其他遊戲也會沿用。
- 糖果煙火：點天空或按大按鈕放煙火，亦支援鍵盤 Enter／空白鍵。

## 開發與驗證

需要 Node.js 22+：

```sh
npm ci
npm run dev
npm run build
npm test
npm run test:browser
```

瀏覽器測試使用本機 Google Chrome，涵蓋 iPad 橫直向、觸控、拖曳、五個玩法、造型保存、靜音、離線重開、窄螢幕與減少動畫。未設定 ESLint。

## GitHub Pages 與 iPad

專案：`kfed0526/skeleton-playground`。網址：`https://kfed0526.github.io/skeleton-playground/`。Pages Source 選 GitHub Actions；main 更新後自動執行鎖定安裝、建置及測試再部署。Vite 前綴固定 `/skeleton-playground/`。

iPad Safari 首次在線完整載入後，可用分享 → 加入主畫面。App Shell、程式、樣式與圖示自動快取，可離線開啟；音效為本機 Web Audio 合成，不需要外部音檔。首次點擊會解鎖音訊，靜音會保存，離開遊戲或切到背景會停止聲音。瀏覽器不支援聲音時仍能正常玩。

圖像為原創 SVG 與系統 Emoji，沒有外部 CDN；系統 Emoji 外觀會依裝置不同。尊重 prefers-reduced-motion。造型只存在 localStorage，清除網站資料會重設。尚需在實體 iPad 驗證音訊及觸控體驗。
