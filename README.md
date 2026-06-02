# 点亮中国城市

这是一个可发布到 GitHub Pages 的个人城市认知地图。记录数据通过 Supabase 同步，iPhone 可用 Safari 添加到主屏幕作为 PWA 使用。

## 1. 配置 Supabase

1. 在 Supabase 新建项目。
2. 打开 SQL Editor，执行 `supabase-schema.sql` 里的全部 SQL。
3. 在 Project Settings > API 复制：
   - Project URL
   - anon public key
4. 打开 `supabase-config.js`，替换占位符：

```js
window.CITY_MAP_SUPABASE = {
  url: "你的 Project URL",
  anonKey: "你的 anon public key"
};
```

## 2. 发布到 GitHub Pages

1. 在 GitHub 新建一个公开项目仓库。
2. 把本地仓库推送到 GitHub。
3. 进入仓库 Settings > Pages。
4. Source 选择 `Deploy from a branch`。
5. Branch 选择 `main`，目录选择 `/root`。
6. 保存后等待 GitHub 生成网址。

## 3. iPhone 使用

1. 用 Safari 打开 GitHub Pages 网址。
2. 点分享按钮。
3. 选择“添加到主屏幕”。
4. 以后从主屏幕打开，和网页使用同一份 Supabase 云端记录。

## 4. 本地旧记录迁移

首次登录后，如果检测到浏览器里已有本地记录，页面会显示“导入本机旧记录”。导入成功后，这些记录会进入 Supabase 云端。
