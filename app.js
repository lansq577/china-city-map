const GEO_BASE_URL = "https://geo.datav.aliyun.com/areas_v3/bound/";
const STORAGE_KEY = "china-city-light-map-v1";
const MIGRATION_KEY = "china-city-light-map-v1-migrated";
const SUPABASE_TABLE = "city_records";
const ECHARTS_FALLBACK_URLS = [
  "https://unpkg.com/echarts@5.5.1/dist/echarts.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/echarts/5.5.1/echarts.min.js"
];

const PROVINCES = [
  { short: "北京", full: "北京市", adcode: "110000", singleCity: true, cityName: "北京市" },
  { short: "天津", full: "天津市", adcode: "120000", singleCity: true, cityName: "天津市" },
  { short: "河北", full: "河北省", adcode: "130000" },
  { short: "山西", full: "山西省", adcode: "140000" },
  { short: "内蒙古", full: "内蒙古自治区", adcode: "150000" },
  { short: "辽宁", full: "辽宁省", adcode: "210000" },
  { short: "吉林", full: "吉林省", adcode: "220000" },
  { short: "黑龙江", full: "黑龙江省", adcode: "230000" },
  { short: "上海", full: "上海市", adcode: "310000", singleCity: true, cityName: "上海市" },
  { short: "江苏", full: "江苏省", adcode: "320000" },
  { short: "浙江", full: "浙江省", adcode: "330000" },
  { short: "安徽", full: "安徽省", adcode: "340000" },
  { short: "福建", full: "福建省", adcode: "350000" },
  { short: "江西", full: "江西省", adcode: "360000" },
  { short: "山东", full: "山东省", adcode: "370000" },
  { short: "河南", full: "河南省", adcode: "410000" },
  { short: "湖北", full: "湖北省", adcode: "420000" },
  { short: "湖南", full: "湖南省", adcode: "430000" },
  { short: "广东", full: "广东省", adcode: "440000" },
  { short: "广西", full: "广西壮族自治区", adcode: "450000" },
  { short: "海南", full: "海南省", adcode: "460000" },
  { short: "重庆", full: "重庆市", adcode: "500000", singleCity: true, cityName: "重庆市" },
  { short: "四川", full: "四川省", adcode: "510000" },
  { short: "贵州", full: "贵州省", adcode: "520000" },
  { short: "云南", full: "云南省", adcode: "530000" },
  { short: "西藏", full: "西藏自治区", adcode: "540000" },
  { short: "陕西", full: "陕西省", adcode: "610000" },
  { short: "甘肃", full: "甘肃省", adcode: "620000" },
  { short: "青海", full: "青海省", adcode: "630000" },
  { short: "宁夏", full: "宁夏回族自治区", adcode: "640000" },
  { short: "新疆", full: "新疆维吾尔自治区", adcode: "650000" },
  { short: "台湾", full: "台湾省", adcode: "710000" },
  { short: "香港", full: "香港特别行政区", adcode: "810000", singleCity: true, cityName: "香港特别行政区" },
  { short: "澳门", full: "澳门特别行政区", adcode: "820000", singleCity: true, cityName: "澳门特别行政区" }
];

const PROVINCE_BY_PREFIX = new Map(PROVINCES.map((province) => [province.adcode.slice(0, 2), province]));
const PROVINCE_PALETTE = [
  "#d9e1db",
  "#dce4e3",
  "#e6dfd3",
  "#d9dde7",
  "#e3d9df",
  "#dfe4d5",
  "#d8e1e9",
  "#e7ddd5",
  "#d8e4dd",
  "#e4decf",
  "#ded9e5",
  "#d4e0df",
  "#e0e3d7",
  "#d8dfe2",
  "#e5dcd8",
  "#d9e2d7"
];
const PROVINCE_COLORS = new Map(
  PROVINCES.map((province, index) => [province.short, PROVINCE_PALETTE[index % PROVINCE_PALETTE.length]])
);
const CAPITALS = [
  { province: "北京", city: "北京市", label: "北京", coord: [116.4074, 39.9042] },
  { province: "天津", city: "天津市", label: "天津", coord: [117.201, 39.0842] },
  { province: "河北", city: "石家庄市", label: "石家庄", coord: [114.5149, 38.0428] },
  { province: "山西", city: "太原市", label: "太原", coord: [112.5492, 37.8706] },
  { province: "内蒙古", city: "呼和浩特市", label: "呼和浩特", coord: [111.7492, 40.8426] },
  { province: "辽宁", city: "沈阳市", label: "沈阳", coord: [123.4315, 41.8057] },
  { province: "吉林", city: "长春市", label: "长春", coord: [125.3235, 43.8171] },
  { province: "黑龙江", city: "哈尔滨市", label: "哈尔滨", coord: [126.5349, 45.8038] },
  { province: "上海", city: "上海市", label: "上海", coord: [121.4737, 31.2304] },
  { province: "江苏", city: "南京市", label: "南京", coord: [118.7969, 32.0603] },
  { province: "浙江", city: "杭州市", label: "杭州", coord: [120.1551, 30.2741] },
  { province: "安徽", city: "合肥市", label: "合肥", coord: [117.2272, 31.8206] },
  { province: "福建", city: "福州市", label: "福州", coord: [119.2965, 26.0745] },
  { province: "江西", city: "南昌市", label: "南昌", coord: [115.8582, 28.6829] },
  { province: "山东", city: "济南市", label: "济南", coord: [117.1201, 36.6512] },
  { province: "河南", city: "郑州市", label: "郑州", coord: [113.6254, 34.7466] },
  { province: "湖北", city: "武汉市", label: "武汉", coord: [114.3054, 30.5931] },
  { province: "湖南", city: "长沙市", label: "长沙", coord: [112.9388, 28.2282] },
  { province: "广东", city: "广州市", label: "广州", coord: [113.2644, 23.1291] },
  { province: "广西", city: "南宁市", label: "南宁", coord: [108.3669, 22.817] },
  { province: "海南", city: "海口市", label: "海口", coord: [110.3312, 20.0311] },
  { province: "重庆", city: "重庆市", label: "重庆", coord: [106.5516, 29.563] },
  { province: "四川", city: "成都市", label: "成都", coord: [104.0665, 30.5723] },
  { province: "贵州", city: "贵阳市", label: "贵阳", coord: [106.6302, 26.647] },
  { province: "云南", city: "昆明市", label: "昆明", coord: [102.8329, 24.8801] },
  { province: "西藏", city: "拉萨市", label: "拉萨", coord: [91.1172, 29.6469] },
  { province: "陕西", city: "西安市", label: "西安", coord: [108.9398, 34.3416] },
  { province: "甘肃", city: "兰州市", label: "兰州", coord: [103.8343, 36.0611] },
  { province: "青海", city: "西宁市", label: "西宁", coord: [101.7782, 36.6171] },
  { province: "宁夏", city: "银川市", label: "银川", coord: [106.2309, 38.4872] },
  { province: "新疆", city: "乌鲁木齐市", label: "乌鲁木齐", coord: [87.6168, 43.8256] },
  { province: "台湾", city: "台北市", label: "台北", coord: [121.5654, 25.033] },
  { province: "香港", city: "香港特别行政区", label: "香港", coord: [114.1694, 22.3193] },
  { province: "澳门", city: "澳门特别行政区", label: "澳门", coord: [113.5439, 22.1987] }
];
const CAPITAL_LABELS = new Map(CAPITALS.map((capital) => [cityKey(capital.province, capital.city), capital.label]));

const mapEl = document.querySelector("#chinaMap");
const mapStatusEl = document.querySelector("#mapStatus");
const authTitleEl = document.querySelector("#authTitle");
const syncStatusEl = document.querySelector("#syncStatus");
const authFormEl = document.querySelector("#authForm");
const authEmailEl = document.querySelector("#authEmail");
const sendLoginLinkEl = document.querySelector("#sendLoginLink");
const authActionsEl = document.querySelector("#authActions");
const migrateLocalDataEl = document.querySelector("#migrateLocalData");
const importDataFileEl = document.querySelector("#importDataFile");
const importDataInputEl = document.querySelector("#importDataInput");
const logoutButtonEl = document.querySelector("#logoutButton");
const authHintEl = document.querySelector("#authHint");
const cityGridEl = document.querySelector("#cityGrid");
const provinceTitleEl = document.querySelector("#provinceTitle");
const provinceProgressEl = document.querySelector("#provinceProgress");
const cityTitleEl = document.querySelector("#cityTitle");
const cityNoteEl = document.querySelector("#cityNote");
const cityPeopleEl = document.querySelector("#cityPeople");
const entryFormEl = document.querySelector("#entryForm");
const saveEntryEl = document.querySelector("#saveEntry");
const clearCityEl = document.querySelector("#clearCity");
const searchEl = document.querySelector("#citySearch");
const searchResultsEl = document.querySelector("#searchResults");
const litCountEl = document.querySelector("#litCount");
const totalCountEl = document.querySelector("#totalCount");
const progressFillEl = document.querySelector("#progressFill");
const exportDataEl = document.querySelector("#exportData");
const nationalMapEl = document.querySelector("#nationalMap");
const resetMapEl = document.querySelector("#resetMap");

let chart = null;
let entries = {};
let supabaseClient = null;
let currentUser = null;
let cloudConfigured = false;
let localOnlyMode = false;
let activeProvince = null;
let selectedProvince = null;
let selectedCity = null;
let allCityGeo = null;
let cityIndex = [];
let provinceGeoCache = new Map();
let loadFailures = [];
let currentMapName = null;
let nationalLabelsVisible = false;
let nationalZoom = 1;

function cityKey(province, city) {
  return `${province}::${city}`;
}

function loadLocalEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveLocalEntries() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function hasLocalEntries() {
  return Object.values(loadLocalEntries()).some((entry) => entry?.note?.trim() || entry?.people?.trim());
}

function localMigrationDone() {
  if (!currentUser) return false;
  return localStorage.getItem(`${MIGRATION_KEY}:${currentUser.id}`) === "1";
}

function markLocalMigrationDone() {
  if (!currentUser) return;
  localStorage.setItem(`${MIGRATION_KEY}:${currentUser.id}`, "1");
}

function setStatus(message, isError = false) {
  mapStatusEl.textContent = message;
  mapStatusEl.classList.toggle("hidden", !message);
  mapStatusEl.style.color = isError ? "#9d2c24" : "";
}

function setSyncStatus(message, state = "idle") {
  syncStatusEl.textContent = message;
  syncStatusEl.dataset.state = state;
}

function supabaseConfig() {
  return window.CITY_MAP_SUPABASE || {};
}

function hasSupabaseConfig() {
  const config = supabaseConfig();
  return Boolean(
    config.url &&
      config.anonKey &&
      !String(config.url).includes("YOUR_SUPABASE_URL") &&
      !String(config.anonKey).includes("YOUR_SUPABASE_ANON_KEY")
  );
}

function canEditRecords() {
  return localOnlyMode || Boolean(currentUser);
}

function entryPayload(key, entry) {
  return {
    user_id: currentUser.id,
    city_key: key,
    province: entry.province,
    city: entry.city,
    people: entry.people || "",
    note: entry.note || "",
    updated_at: entry.updatedAt || new Date().toISOString()
  };
}

function rowToEntry(row) {
  return {
    province: row.province,
    city: row.city,
    people: row.people || "",
    note: row.note || "",
    updatedAt: row.updated_at || ""
  };
}

async function initCloudSync() {
  cloudConfigured = hasSupabaseConfig() && Boolean(window.supabase?.createClient);

  if (!cloudConfigured) {
    localOnlyMode = true;
    entries = loadLocalEntries();
    setSyncStatus("本机模式", "warning");
    authTitleEl.textContent = "待配置云同步";
    authFormEl.classList.add("hidden");
    authActionsEl.classList.add("hidden");
    authHintEl.textContent = "填写 supabase-config.js 后，上线网址即可启用邮箱登录和云端同步。当前仍使用本机记录。";
    return;
  }

  localOnlyMode = false;
  const config = supabaseConfig();
  supabaseClient = window.supabase.createClient(config.url, config.anonKey);
  const { data } = await supabaseClient.auth.getSession();
  currentUser = data.session?.user || null;

  supabaseClient.auth.onAuthStateChange(async (_event, session) => {
    currentUser = session?.user || null;
    if (currentUser) {
      await loadCloudEntries();
    } else {
      entries = {};
    }
    renderAuthState();
    render();
  });

  if (currentUser) {
    await loadCloudEntries();
  } else {
    entries = {};
  }

  renderAuthState();
}

async function loadCloudEntries() {
  if (!supabaseClient || !currentUser) return;

  setSyncStatus("同步中", "loading");
  const { data, error } = await supabaseClient
    .from(SUPABASE_TABLE)
    .select("city_key, province, city, people, note, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    setSyncStatus("同步失败", "error");
    authHintEl.textContent = `读取云端记录失败：${error.message}`;
    return;
  }

  entries = {};
  (data || []).forEach((row) => {
    entries[row.city_key] = rowToEntry(row);
  });
  setSyncStatus("已同步", "success");
}

async function saveEntry(key, entry) {
  entries[key] = entry;

  if (localOnlyMode) {
    saveLocalEntries();
    return;
  }

  if (!supabaseClient || !currentUser) {
    throw new Error("请先登录后再保存。");
  }

  setSyncStatus("保存中", "loading");
  const { error } = await supabaseClient
    .from(SUPABASE_TABLE)
    .upsert(entryPayload(key, entry), {
      onConflict: "user_id,city_key"
    });

  if (error) {
    setSyncStatus("保存失败", "error");
    throw error;
  }

  setSyncStatus("已保存", "success");
}

async function deleteEntry(key) {
  delete entries[key];

  if (localOnlyMode) {
    saveLocalEntries();
    return;
  }

  if (!supabaseClient || !currentUser) {
    throw new Error("请先登录后再清空记录。");
  }

  setSyncStatus("保存中", "loading");
  const { error } = await supabaseClient.from(SUPABASE_TABLE).delete().eq("city_key", key);

  if (error) {
    setSyncStatus("保存失败", "error");
    throw error;
  }

  setSyncStatus("已保存", "success");
}

async function migrateLocalEntries() {
  if (!supabaseClient || !currentUser) return;

  const localEntries = loadLocalEntries();
  const rows = Object.entries(localEntries)
    .filter(([, entry]) => entry?.note?.trim() || entry?.people?.trim())
    .map(([key, entry]) => entryPayload(key, entry));

  if (!rows.length) {
    markLocalMigrationDone();
    renderAuthState();
    return;
  }

  setSyncStatus("导入中", "loading");
  const { error } = await supabaseClient.from(SUPABASE_TABLE).upsert(rows, {
    onConflict: "user_id,city_key"
  });

  if (error) {
    setSyncStatus("导入失败", "error");
    authHintEl.textContent = `导入本机记录失败：${error.message}`;
    return;
  }

  markLocalMigrationDone();
  await loadCloudEntries();
  renderAuthState();
  render();
}

function normalizeImportedRecord(record) {
  const province = String(record?.province || record?.provinceName || "").trim();
  const city = String(record?.city || record?.cityName || "").trim();
  const people = String(record?.people || "").trim();
  const note = String(record?.note || "").trim();

  if (!province || !city || (!people && !note)) return null;

  return {
    key: cityKey(province, city),
    entry: {
      province,
      city,
      people,
      note,
      updatedAt: record?.updatedAt || new Date().toISOString()
    }
  };
}

async function importEntriesFromFile(file) {
  if (!supabaseClient || !currentUser) {
    authHintEl.textContent = "请先登录后再导入记录文件。";
    return;
  }

  let payload = null;
  try {
    payload = JSON.parse(await file.text());
  } catch {
    authHintEl.textContent = "记录文件读取失败，请选择导出的 JSON 文件。";
    return;
  }

  const rawRecords = Array.isArray(payload) ? payload : payload.records;
  if (!Array.isArray(rawRecords)) {
    authHintEl.textContent = "记录文件格式不正确，请选择“导出全部记录”生成的文件。";
    return;
  }

  const imported = rawRecords.map(normalizeImportedRecord).filter(Boolean);
  if (!imported.length) {
    authHintEl.textContent = "记录文件里没有可导入的城市记录。";
    return;
  }

  const rows = imported.map(({ key, entry }) => entryPayload(key, entry));

  setSyncStatus("导入中", "loading");
  const { error } = await supabaseClient.from(SUPABASE_TABLE).upsert(rows, {
    onConflict: "user_id,city_key"
  });

  if (error) {
    setSyncStatus("导入失败", "error");
    authHintEl.textContent = `导入记录文件失败：${error.message}`;
    return;
  }

  await loadCloudEntries();
  authHintEl.textContent = `已导入 ${imported.length} 条记录。`;
  render();
}

function renderAuthState() {
  if (localOnlyMode) return;

  if (!currentUser) {
    setSyncStatus("未登录", "idle");
    authTitleEl.textContent = "登录后同步";
    authFormEl.classList.remove("hidden");
    authActionsEl.classList.add("hidden");
    authHintEl.textContent = "输入邮箱后会收到登录链接；登录后电脑和 iPhone 会同步同一份记录。";
    return;
  }

  authTitleEl.textContent = currentUser.email || "已登录";
  authFormEl.classList.add("hidden");
  authActionsEl.classList.remove("hidden");

  const shouldMigrate = hasLocalEntries() && !localMigrationDone();
  migrateLocalDataEl.hidden = !shouldMigrate;
  authHintEl.textContent = shouldMigrate
    ? "检测到本机旧记录，可以导入到云端。导入只需执行一次。"
    : "云端同步已启用。手机和电脑登录同一邮箱即可同步。";
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {
      // PWA support is optional; the app still works in a normal browser tab.
    });
  });
}

function getProvince(shortName) {
  return PROVINCES.find((province) => province.short === shortName);
}

function getEntry(key) {
  return entries[key];
}

function isLit(key) {
  const entry = getEntry(key);
  return Boolean(entry?.note?.trim() || entry?.people?.trim());
}

function selectedKey() {
  if (!selectedProvince || !selectedCity) return null;
  return cityKey(selectedProvince, selectedCity);
}

async function fetchGeoJson(adcode, full) {
  const suffix = full ? "_full" : "";
  return fetchGeoFile(`${adcode}${suffix}.json`);
}

async function fetchGeoFile(fileName) {
  const response = await fetch(`${GEO_BASE_URL}${fileName}`, {
    referrerPolicy: "no-referrer"
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

async function loadProvinceGeo(province) {
  if (provinceGeoCache.has(province.short)) {
    return provinceGeoCache.get(province.short);
  }

  let sourceGeo = null;
  let singleFeatureMode = Boolean(province.singleCity);

  try {
    sourceGeo = await fetchGeoJson(province.adcode, !province.singleCity);
  } catch (error) {
    sourceGeo = await fetchGeoJson(province.adcode, false);
    singleFeatureMode = true;
  }

  const features = (sourceGeo.features || [])
    .filter((feature) => feature.geometry)
    .map((feature) => normalizeFeature(feature, province, singleFeatureMode));

  if (!features.length) {
    throw new Error(`${province.full} 没有可用边界`);
  }

  const normalizedGeo = {
    type: "FeatureCollection",
    features
  };

  provinceGeoCache.set(province.short, normalizedGeo);
  return normalizedGeo;
}

function normalizeFeature(feature, province, singleFeatureMode) {
  const rawName = feature.properties?.name || province.cityName || province.full;
  const cityName = singleFeatureMode ? province.cityName || province.full : rawName;
  const key = cityKey(province.short, cityName);

  return {
    ...feature,
    properties: {
      ...(feature.properties || {}),
      name: key,
      cityKey: key,
      cityName,
      provinceName: province.short,
      provinceFullName: province.full,
      provinceAdcode: province.adcode,
      adcode: feature.properties?.adcode || province.adcode
    }
  };
}

async function loadAllCities() {
  try {
    await loadAllCitiesFromNationalFile();
  } catch (error) {
    await loadAllCitiesFromProvinceFiles();
  }
}

async function loadAllCitiesFromNationalFile() {
  setStatus("加载全国城市边界...");
  loadFailures = [];

  const sourceGeo = await fetchGeoFile("100000_full_city.json");
  const features = (sourceGeo.features || [])
    .filter((feature) => feature.geometry)
    .map(normalizeNationalCityFeature)
    .filter((feature) => feature && !getProvince(feature.properties.provinceName)?.singleCity);

  if (!features.length) {
    throw new Error("全国城市边界为空");
  }

  const loadedProvinceNames = new Set(features.map((feature) => feature.properties.provinceName));
  const supplementalProvinces = PROVINCES.filter((province) => province.singleCity || !loadedProvinceNames.has(province.short));
  if (supplementalProvinces.length) {
    setStatus(`补充加载：${supplementalProvinces.map((province) => province.short).join("、")}`);
    const supplemental = await Promise.allSettled(supplementalProvinces.map((province) => loadProvinceGeo(province)));
    supplemental.forEach((result, index) => {
      if (result.status === "fulfilled") {
        features.push(...result.value.features);
      } else {
        loadFailures.push(supplementalProvinces[index].short);
      }
    });
  }

  setAllCityGeo(features);
}

function normalizeNationalCityFeature(feature) {
  const rawName = feature.properties?.name;
  const rawAdcode = String(feature.properties?.adcode || "");
  const parentAdcode = String(feature.properties?.parent?.adcode || "");
  const province = PROVINCE_BY_PREFIX.get((parentAdcode || rawAdcode).slice(0, 2));

  if (!rawName || !province) return null;

  const cityName = province.singleCity ? province.cityName || province.full : rawName;
  const key = cityKey(province.short, cityName);

  return {
    ...feature,
    properties: {
      ...(feature.properties || {}),
      name: key,
      cityKey: key,
      cityName,
      provinceName: province.short,
      provinceFullName: province.full,
      provinceAdcode: province.adcode,
      adcode: rawAdcode || province.adcode
    }
  };
}

async function loadAllCitiesFromProvinceFiles() {
  setStatus(`加载城市边界 0/${PROVINCES.length}`);

  let loaded = 0;
  const results = await Promise.allSettled(
    PROVINCES.map(async (province) => {
      const geo = await loadProvinceGeo(province);
      loaded += 1;
      setStatus(`加载城市边界 ${loaded}/${PROVINCES.length}`);
      return geo;
    })
  );

  const features = [];
  loadFailures = [];

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      features.push(...result.value.features);
    } else {
      loadFailures.push(PROVINCES[index].short);
    }
  });

  if (!features.length) {
    throw new Error("城市边界数据加载失败");
  }

  setAllCityGeo(features);
}

function setAllCityGeo(features) {
  const uniqueFeatures = [];
  const seenKeys = new Set();
  features.forEach((feature) => {
    const key = feature.properties?.cityKey;
    if (!key || seenKeys.has(key)) return;
    seenKeys.add(key);
    uniqueFeatures.push(feature);
  });

  allCityGeo = {
    type: "FeatureCollection",
    features: uniqueFeatures
  };

  cityIndex = allCityGeo.features
    .map((feature) => feature.properties)
    .sort((a, b) => `${a.provinceName}${a.cityName}`.localeCompare(`${b.provinceName}${b.cityName}`, "zh-Hans-CN"));

  rebuildProvinceGeoCacheFromNational();
}

function rebuildProvinceGeoCacheFromNational() {
  PROVINCES.forEach((province) => {
    const features = allCityGeo.features.filter((feature) => feature.properties.provinceName === province.short);
    if (!features.length) return;
    provinceGeoCache.set(province.short, {
      type: "FeatureCollection",
      features
    });
  });
}

function provinceColor(provinceName) {
  return PROVINCE_COLORS.get(provinceName) || "#e7ece8";
}

function cityAreaColor(props, lit, selected, isProvinceView) {
  if (selected) return "#ead8c6";
  if (lit) return "#d7c394";
  return isProvinceView ? "#eef2ef" : provinceColor(props.provinceName);
}

function cityDataFromFeatures(features, isProvinceView) {
  const key = selectedKey();
  return features.map((feature) => {
    const props = feature.properties;
    const lit = isLit(props.cityKey);
    const selected = props.cityKey === key;

    return {
      name: props.cityKey,
      value: lit ? 1 : 0,
      cityKey: props.cityKey,
      cityName: props.cityName,
      provinceName: props.provinceName,
      itemStyle: {
        areaColor: cityAreaColor(props, lit, selected, isProvinceView),
        borderColor: selected ? "#8f5f52" : isProvinceView ? "#b8c3bd" : "rgba(255, 255, 255, 0.88)",
        borderWidth: selected ? 1.5 : isProvinceView ? 0.65 : 0.55
      }
    };
  });
}

function cityRegionsFromFeatures(features, isProvinceView) {
  return cityDataFromFeatures(features, isProvinceView).map((city) => ({
    name: city.name,
    itemStyle: city.itemStyle
  }));
}

function currentMapView(mapName) {
  const option = chart?.getOption?.();
  const geos = Array.isArray(option?.geo) ? option.geo : option?.geo ? [option.geo] : [];
  const geo = geos.find((item) => item.id === "map-geo" && item.map === mapName);

  return {
    zoom: typeof geo?.zoom === "number" ? geo.zoom : undefined,
    center: Array.isArray(geo?.center) ? geo.center : undefined
  };
}

function selectedCityCenter(features) {
  const key = selectedKey();
  if (!key) return null;

  const feature = features.find((item) => item.properties?.cityKey === key);
  return feature ? featureCenter(feature) : null;
}

function featureCenter(feature) {
  const props = feature.properties || {};
  const knownCenter = props.centroid || props.center;
  if (Array.isArray(knownCenter) && knownCenter.length >= 2) {
    return [Number(knownCenter[0]), Number(knownCenter[1])];
  }

  const bounds = {
    minLng: Infinity,
    maxLng: -Infinity,
    minLat: Infinity,
    maxLat: -Infinity
  };

  collectCoordinateBounds(feature.geometry?.coordinates, bounds);

  if (!Number.isFinite(bounds.minLng) || !Number.isFinite(bounds.minLat)) {
    return null;
  }

  return [(bounds.minLng + bounds.maxLng) / 2, (bounds.minLat + bounds.maxLat) / 2];
}

function collectCoordinateBounds(coordinates, bounds) {
  if (!Array.isArray(coordinates)) return;

  if (typeof coordinates[0] === "number" && typeof coordinates[1] === "number") {
    bounds.minLng = Math.min(bounds.minLng, coordinates[0]);
    bounds.maxLng = Math.max(bounds.maxLng, coordinates[0]);
    bounds.minLat = Math.min(bounds.minLat, coordinates[1]);
    bounds.maxLat = Math.max(bounds.maxLat, coordinates[1]);
    return;
  }

  coordinates.forEach((item) => collectCoordinateBounds(item, bounds));
}

function cityFromMapName(name) {
  const city = cityIndex.find((item) => item.cityKey === name);
  if (city) return city;

  const parts = String(name || "").split("::");
  if (parts.length !== 2) return null;

  return {
    cityKey: name,
    provinceName: parts[0],
    cityName: parts[1]
  };
}

function cityLabelFormatter(name, isProvinceView) {
  const city = cityFromMapName(name);
  if (!city) return "";

  const capitalLabel = CAPITAL_LABELS.get(city.cityKey);
  if (capitalLabel) {
    return `{capitalDot|●} {capitalName|${capitalLabel}}`;
  }

  if (isProvinceView || nationalLabelsVisible) {
    return city.cityName;
  }

  return "";
}

function renderMap() {
  if (!chart || !allCityGeo) return;

  const province = activeProvince ? getProvince(activeProvince) : null;
  const geo = province ? provinceGeoCache.get(province.short) : allCityGeo;
  if (!geo) return;

  const mapName = province ? `province-${province.adcode}` : "china-city-level";
  const isProvinceView = Boolean(province);
  const mapChanged = currentMapName !== mapName;
  const preservedView = mapChanged ? null : currentMapView(mapName);
  const centerTarget = selectedCityCenter(geo.features);
  currentMapName = mapName;
  if (mapChanged && !isProvinceView) {
    nationalZoom = 1;
    nationalLabelsVisible = false;
  }

  echarts.registerMap(mapName, geo);
  chart.off("click");
  chart.off("georoam");
  chart.on("click", (params) => {
    const city = params.data?.cityName
      ? params.data
      : cityFromMapName(params.name);
    if (!city?.cityName || !city?.provinceName) return;
    selectCity(city.provinceName, city.cityName);
  });
  chart.on("georoam", (params) => {
    if (isProvinceView) return;
    if (typeof params?.zoom === "number") {
      nationalZoom *= params.zoom;
    }

    const currentZoom = currentMapView(mapName).zoom || nationalZoom;
    const shouldShow = currentZoom >= 2.6;

    if (shouldShow !== nationalLabelsVisible) {
      nationalLabelsVisible = shouldShow;
      chart.setOption({
        geo: {
          id: "map-geo",
          label: {
            show: true
          }
        }
      });
    }
  });

  const geoOption = {
    id: "map-geo",
    map: mapName,
    roam: true,
    zoom: preservedView?.zoom || (mapChanged ? (isProvinceView ? 1.08 : 1) : undefined),
    center: centerTarget || preservedView?.center,
    scaleLimit: {
      min: 0.85,
      max: 8
    },
    layoutCenter: ["50%", "52%"],
    layoutSize: isProvinceView ? "92%" : "96%",
    nameProperty: "name",
    regions: cityRegionsFromFeatures(geo.features, isProvinceView),
    label: {
      show: true,
      color: "#39443f",
      fontSize: isProvinceView ? 10 : 9,
      fontWeight: isProvinceView ? 700 : 600,
      backgroundColor: "rgba(255, 255, 255, 0.72)",
      borderColor: "rgba(63, 76, 69, 0.1)",
      borderWidth: 1,
      borderRadius: 4,
      padding: [1, 4],
      rich: {
        capitalDot: {
          color: "#9f5b4f",
          fontSize: 10,
          fontWeight: 900
        },
        capitalName: {
          color: "#2f3a35",
          fontSize: 11,
          fontWeight: 800
        }
      },
      formatter(params) {
        return cityLabelFormatter(params.name, isProvinceView);
      }
    },
    emphasis: {
      label: {
        show: false,
        formatter(params) {
          return cityLabelFormatter(params.name, isProvinceView);
        }
      },
      itemStyle: {
        areaColor: "#e6d8c7",
        borderColor: "#9f5b4f",
        borderWidth: 1.2
      }
    },
    itemStyle: {
      areaColor: isProvinceView ? "#eef2ef" : "#e7ece8",
      borderColor: isProvinceView ? "#b8c3bd" : "rgba(255, 255, 255, 0.9)",
      borderWidth: isProvinceView ? 0.65 : 0.55
    }
  };

  chart.setOption(
    {
      animation: false,
      backgroundColor: "transparent",
      geo: geoOption,
      tooltip: {
        trigger: "item",
        borderColor: "#dfe5e0",
        formatter(params) {
          const city = params.data?.cityKey ? params.data : cityFromMapName(params.name);
          if (!city?.cityKey) return "";
          const entry = getEntry(city.cityKey);
          const status = entry?.note?.trim() ? "已点亮" : "未点亮";
          const note = entry?.note?.trim() ? `<br/>${escapeHtml(entry.note.trim()).slice(0, 80)}` : "";
          return `<strong>${city.provinceName} · ${city.cityName}</strong><br/>${status}${note}`;
        }
      },
      series: []
    },
    {
      notMerge: mapChanged,
      replaceMerge: ["series"]
    }
  );
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return entities[char];
  });
}

function renderStats() {
  const total = cityIndex.length;
  const lit = cityIndex.filter((city) => isLit(city.cityKey)).length;
  litCountEl.textContent = lit;
  totalCountEl.textContent = `/ ${total}`;
  progressFillEl.style.width = total ? `${Math.round((lit / total) * 100)}%` : "0%";
}

function renderListPanel() {
  cityGridEl.innerHTML = "";

  if (!activeProvince) {
    const total = cityIndex.length;
    const lit = cityIndex.filter((city) => isLit(city.cityKey)).length;
    provinceTitleEl.textContent = "全国城市地图";
    provinceProgressEl.textContent = `${lit}/${total}`;

    PROVINCES.forEach((province) => {
      const cities = cityIndex.filter((city) => city.provinceName === province.short);
      if (!cities.length) return;

      const provinceLit = cities.filter((city) => isLit(city.cityKey)).length;
      const button = document.createElement("button");
      button.type = "button";
      button.className = ["city-button", provinceLit === cities.length ? "lit" : ""].join(" ");
      button.innerHTML = `${province.short}<small>${provinceLit}/${cities.length}</small>`;
      button.addEventListener("click", () => showProvince(province.short));
      cityGridEl.appendChild(button);
    });
    return;
  }

  const cities = cityIndex.filter((city) => city.provinceName === activeProvince);
  const lit = cities.filter((city) => isLit(city.cityKey)).length;
  provinceTitleEl.textContent = activeProvince;
  provinceProgressEl.textContent = `${lit}/${cities.length}`;

  cities.forEach((city) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = [
      "city-button",
      isLit(city.cityKey) ? "lit" : "",
      selectedKey() === city.cityKey ? "selected" : ""
    ].join(" ");
    button.textContent = city.cityName;
    button.addEventListener("click", () => selectCity(city.provinceName, city.cityName));
    cityGridEl.appendChild(button);
  });
}

function renderSelectedCity() {
  if (!selectedProvince || !selectedCity) {
    cityTitleEl.textContent = "选择一个城市";
    cityNoteEl.value = "";
    cityPeopleEl.value = "";
    cityNoteEl.disabled = true;
    cityPeopleEl.disabled = true;
    saveEntryEl.disabled = true;
    clearCityEl.disabled = true;
    return;
  }

  const editable = canEditRecords();
  const key = selectedKey();
  const entry = getEntry(key) || {};
  const note = entry.note || "";
  const people = entry.people || "";
  cityTitleEl.textContent = `${selectedProvince} · ${selectedCity}`;
  cityNoteEl.value = note;
  cityPeopleEl.value = people;
  cityNoteEl.disabled = !editable;
  cityPeopleEl.disabled = !editable;
  cityNoteEl.placeholder = editable ? "写下你对这个城市的评价、了解、印象、想去的理由……" : "请先登录后填写记录";
  cityPeopleEl.placeholder = editable ? "例如：张三、李四" : "请先登录后填写人名";
  saveEntryEl.disabled = !editable;
  clearCityEl.disabled = !editable || (!note && !people);
}

function renderSearchResults() {
  const keyword = searchEl.value.trim();
  searchResultsEl.innerHTML = "";

  if (!keyword || !cityIndex.length) return;

  const hits = cityIndex
    .map((city) => {
      const entry = getEntry(city.cityKey) || {};
      const searchable = [
        city.cityName,
        city.provinceName,
        city.provinceFullName,
        entry.note,
        entry.people
      ]
        .filter(Boolean)
        .join(" ");

      if (!searchable.includes(keyword)) return null;

      const matchedBy = [];
      if (city.cityName.includes(keyword)) matchedBy.push("城市");
      if (city.provinceName.includes(keyword) || city.provinceFullName.includes(keyword)) matchedBy.push("省份");
      if (entry.people?.includes(keyword)) matchedBy.push("人名");
      if (entry.note?.includes(keyword)) matchedBy.push("记录");

      return {
        ...city,
        matchedBy: matchedBy.join("、") || "内容"
      };
    })
    .filter(Boolean)
    .slice(0, 10);

  hits.forEach((hit) => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "search-hit";
    row.innerHTML = `<span>${hit.provinceName} · ${hit.cityName}<small>匹配：${hit.matchedBy}</small></span><span>${isLit(hit.cityKey) ? "已点亮" : "未点亮"}</span>`;
    row.addEventListener("click", () => {
      activeProvince = null;
      nationalLabelsVisible = false;
      nationalZoom = 1;
      currentMapName = null;
      selectCity(hit.provinceName, hit.cityName);
      searchEl.value = "";
      searchResultsEl.innerHTML = "";
    });
    searchResultsEl.appendChild(row);
  });
}

function render() {
  renderStats();
  renderListPanel();
  renderSelectedCity();
  renderMap();
}

function showProvince(provinceName) {
  activeProvince = provinceName;
  nationalLabelsVisible = false;
  nationalZoom = 1;
  currentMapName = null;
  render();
}

function showNationalMap() {
  activeProvince = null;
  nationalLabelsVisible = false;
  nationalZoom = 1;
  currentMapName = null;
  render();
}

function resetMapView() {
  nationalLabelsVisible = false;
  nationalZoom = 1;
  currentMapName = null;
  selectedProvince = null;
  selectedCity = null;
  render();
}

function selectCity(provinceName, cityName) {
  selectedProvince = provinceName;
  selectedCity = cityName;
  render();
}

entryFormEl.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!selectedProvince || !selectedCity) return;

  const key = selectedKey();
  const note = cityNoteEl.value.trim();
  const people = cityPeopleEl.value.trim();
  saveEntryEl.disabled = true;

  try {
    if (!note && !people) {
      await deleteEntry(key);
    } else {
      await saveEntry(key, {
        province: selectedProvince,
        city: selectedCity,
        people,
        note,
        updatedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    authHintEl.textContent = error.message || "保存失败，请稍后重试。";
  }

  render();
});

clearCityEl.addEventListener("click", async () => {
  if (!selectedProvince || !selectedCity) return;
  clearCityEl.disabled = true;
  try {
    await deleteEntry(selectedKey());
  } catch (error) {
    authHintEl.textContent = error.message || "清空失败，请稍后重试。";
  }
  render();
});

searchEl.addEventListener("input", renderSearchResults);
nationalMapEl.addEventListener("click", showNationalMap);
resetMapEl.addEventListener("click", resetMapView);

authFormEl.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!cloudConfigured || !supabaseClient) return;

  const email = authEmailEl.value.trim();
  if (!email) return;

  sendLoginLinkEl.disabled = true;
  setSyncStatus("发送中", "loading");

  const { error } = await supabaseClient.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.href.split("#")[0]
    }
  });

  sendLoginLinkEl.disabled = false;

  if (error) {
    setSyncStatus("发送失败", "error");
    authHintEl.textContent = `登录链接发送失败：${error.message}`;
    return;
  }

  setSyncStatus("等待登录", "idle");
  authHintEl.textContent = "登录链接已发送，请打开邮箱中的链接完成登录。";
});

logoutButtonEl.addEventListener("click", async () => {
  if (!supabaseClient) return;
  await supabaseClient.auth.signOut();
});

migrateLocalDataEl.addEventListener("click", migrateLocalEntries);
importDataFileEl.addEventListener("click", () => importDataInputEl.click());
importDataInputEl.addEventListener("change", async () => {
  const [file] = importDataInputEl.files || [];
  if (!file) return;
  await importEntriesFromFile(file);
  importDataInputEl.value = "";
});

exportDataEl.addEventListener("click", () => {
  const records = cityIndex
    .map((city) => {
      const entry = getEntry(city.cityKey);
      if (!entry?.note?.trim() && !entry?.people?.trim()) return null;

      return {
        province: city.provinceName,
        provinceFullName: city.provinceFullName,
        city: city.cityName,
        people: entry.people || "",
        note: entry.note || "",
        updatedAt: entry.updatedAt || ""
      };
    })
    .filter(Boolean);
  const payload = JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      totalCities: cityIndex.length,
      recordedCities: records.length,
      records
    },
    null,
    2
  );
  const blob = new Blob([payload], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "china-city-all-records.json";
  link.click();
  URL.revokeObjectURL(url);
});

async function init() {
  await initCloudSync();

  const hasMapEngine = await ensureEcharts();
  if (!hasMapEngine) {
    setStatus("地图引擎加载失败，请检查网络后刷新。", true);
    return;
  }

  chart = echarts.init(mapEl);
  chart.showLoading({
    text: "加载城市边界...",
    color: "#5f7f72",
    textColor: "#738078",
    maskColor: "rgba(248, 249, 246, 0.76)"
  });

  try {
    await loadAllCities();
    chart.hideLoading();
    setStatus(loadFailures.length ? `部分地区加载失败：${loadFailures.join("、")}` : "");
    render();
  } catch (error) {
    chart.hideLoading();
    setStatus("城市边界数据加载失败，请确认联网后刷新。", true);
  }

  window.addEventListener("resize", () => {
    chart.resize();
  });
}

registerServiceWorker();
init();

function ensureEcharts() {
  if (window.echarts) {
    return Promise.resolve(true);
  }

  return ECHARTS_FALLBACK_URLS.reduce((chain, url) => {
    return chain.then((loaded) => {
      if (loaded || window.echarts) return true;
      return loadScript(url);
    });
  }, Promise.resolve(false));
}

function loadScript(url) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.referrerPolicy = "no-referrer";
    script.onload = () => resolve(Boolean(window.echarts));
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}
