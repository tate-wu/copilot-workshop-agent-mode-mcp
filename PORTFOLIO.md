![工作坊完成徽章](https://img.shields.io/badge/GitHub_Copilot_實戰工作坊-已完成-1F883D?style=for-the-badge&logo=githubcopilot&logoColor=white)
# 待辦清單 Web App

這是在 **GitHub Copilot 實戰工作坊**完成的待辦清單 Web App。使用者可以管理日常待辦、篩選不同狀態的項目，並透過深色模式與本機儲存，在不同瀏覽器工作階段中延續使用。

## 線上展示

[開啟 GitHub Pages 展示](https://tate-wu.github.io/copilot-workshop-agent-mode-mcp/)

> 將上方網址中的佔位文字替換成實際的 GitHub 帳號與儲存庫名稱。

## 功能

- 新增待辦事項；空白內容不會送出，輸入長度上限為 200 個字元。
- 勾選待辦事項以標記完成，也可以取消完成；完成項目會以刪除線和淡化樣式呈現。
- 個別刪除待辦事項。
- 一次清除所有已完成項目；清除前會要求確認，沒有已完成項目時按鈕會停用。
- 依「全部」、「未完成」或「已完成」篩選清單，並在沒有符合項目時顯示提示。
- 顯示未完成項目的數量。
- 切換深色與淺色主題；尚未手動選擇主題時，會跟隨作業系統偏好。
- 將待辦資料與手動選擇的主題儲存在瀏覽器 `localStorage`，重新整理後仍可讀取。
- 採用適應手機螢幕的版面，並提供表單標籤、操作按鈕的輔助標籤與清單更新提示。

## 技術

- 使用純 HTML、CSS 與原生 JavaScript 製作。
- 不使用前端框架或第三方套件；不需建置流程。
- 待辦事項與主題偏好儲存在瀏覽器的 `localStorage`。
- 使用 CSS 變數管理色彩，並透過 `prefers-color-scheme` 讀取系統主題偏好。
- 以 GitHub Pages 作為靜態網頁展示方式；部署網址以實際啟用設定為準。

## 開發方式

本專案依照 GitHub Copilot 實戰工作坊的 Agentic Workflow 概念進行：

- **GitHub Copilot Agent Mode**：以自然語言描述需求，協助理解專案、修改相關檔案，並配合瀏覽器確認功能。
- **MCP**：工作坊流程使用 Microsoft Learn 與 GitHub MCP Server，讓 Agent 能查詢官方文件，以及讀取 GitHub issue 等資訊。
- **`.github/prompts` 任務提示**：`fix-issue.prompt.md` 將讀取 issue、提出修改計畫、建立分支、實作、驗證、提交與建立 Pull Request 等步驟整理成可重複使用的流程。
- **專案指示**：`.github/copilot-instructions.md` 記錄技術限制、程式風格與協作規則，作為修改時的依據。

## 我學到什麼

- 將需求、限制與驗收方式說清楚，有助於 Agent 產出更符合預期的修改。
- Agent Mode 可以協助跨檔案完成工作，但仍需要檢查差異並實際驗證結果。
- MCP 能讓 Agent 透過工具取得本機檔案以外的文件或 GitHub 資訊。
- 將重複的任務流程寫成 repo 內的提示檔，能讓流程更一致，也便於持續調整。
- 使用 Git 分支、提交與 Pull Request，可以檢視並管理 Agent 協作產生的變更。
