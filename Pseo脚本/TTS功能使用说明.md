# Google表格TTS功能使用说明

## 🎯 功能概述

现在您的Google表格脚本已经集成了强大的批量TTS（文本转语音）功能！您可以直接在Google表格中：

- ✅ **批量转换单词列表**为单独的音频文件
- ✅ **自动命名**每个音频文件对应单词内容
- ✅ **保存到Google Drive**，方便管理
- ✅ **完全自动化**，无需手动操作

## 🚀 使用方法

### 1. 设置TTS参数

在您的 `Settings` 工作表中，添加以下TTS设置（在B42-B46行）：

| 行 | 列B | 说明 | 示例值 |
|----|----|------|--------|
| B42 | TTS语言 | 语言代码 | `zh-cn` (中文) 或 `en` (英文) |
| B43 | TTS引擎 | 引擎类型 | `gtts` (Google TTS) |
| B44 | TTS语音 | 语音设置 | `default` |
| B45 | TTS语速 | 语速倍数 | `1.0` |
| B46 | TTS音量 | 音量大小 | `0.9` |

### 2. 准备单词数据

在任意工作表的A列中，按以下格式准备单词列表：

```
A1: 单词 (标题行)
A2: 苹果
A3: 香蕉
A4: 橙子
A5: 葡萄
...
```

### 3. 运行TTS转换

#### 方法一：批量转换
1. 选择包含单词列表的工作表
2. 点击菜单栏中的 **🎉 Generate**
3. 选择 **🎵 批量TTS转换**
4. 确认转换设置
5. 等待转换完成

#### 方法二：单个转换
1. 选择要转换的单个单词单元格
2. 点击菜单栏中的 **🎉 Generate**
3. 选择 **🎵 单词转音频**
4. 等待转换完成

## 📁 输出结果

### 音频文件位置
所有生成的音频文件会自动保存到Google Drive的 **"TTS音频文件"** 文件夹中。

### 文件命名规则
- 文件名 = 单词内容 + `.mp3`
- 自动清理非法字符
- 示例：`苹果.mp3`, `香蕉.mp3`, `橙子.mp3`

### 工作表结果记录（WP All Import兼容）
转换完成后，系统会在当前工作表中自动添加结果列：

| A列 | B列 | C列 | D列 |
|-----|-----|-----|-----|
| 单词 | audio_url | audio_status | audio_filename |
| 苹果 | https://drive.google.com/... | ✓ 苹果.mp3 | 苹果.mp3 |
| 香蕉 | https://drive.google.com/... | ✓ 香蕉.mp3 | 香蕉.mp3 |

- **B列 audio_url**：直接URL链接（WP All Import兼容）
- **C列 audio_status**：显示转换成功/失败状态
- **D列 audio_filename**：文件名（用于识别和调试）

## ⚙️ 配置选项

### 支持的语言代码
| 语言 | 代码 | 语言 | 代码 |
|------|------|------|------|
| 中文 | `zh-cn` | 英文 | `en` |
| 日文 | `ja` | 韩文 | `ko` |
| 法文 | `fr` | 德文 | `de` |
| 西班牙文 | `es` | 俄文 | `ru` |

### TTS引擎说明
- **gtts**：Google Text-to-Speech，免费，音质好，需要网络
- **azure**：Azure Speech Services（暂未实现）

## 🔧 高级用法

### 自定义处理流程
您可以在现有的处理流程中集成TTS功能：

```javascript
// 在现有函数中添加TTS转换
function customProcessWithTTS() {
  // 您的现有逻辑
  var words = ["苹果", "香蕉", "橙子"];
  
  // 添加TTS转换
  var settings = getTTSSettings();
  var results = convertWordsToAudio(words, settings);
  
  // 处理结果
  Logger.log(`转换了 ${results.success} 个音频文件`);
}
```

### 批量处理多个工作表
```javascript
function processAllSheetsWithTTS() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = spreadsheet.getSheets();
  
  sheets.forEach(function(sheet) {
    if (sheet.getName() !== "Settings") {
      var words = getWordListFromSheet(sheet);
      if (words.length > 0) {
        var settings = getTTSSettings();
        convertWordsToAudio(words, settings);
      }
    }
  });
}
```

## 🎵 使用示例

### 示例1：中文单词学习
1. 在A列输入：苹果、香蕉、橙子、葡萄
2. 设置B42为：`zh-cn`
3. 运行批量TTS转换
4. 获得结果：

| A列 | B列 | C列 | D列 |
|-----|-----|-----|-----|
| 单词 | audio_url | audio_status | audio_filename |
| 苹果 | https://drive.google.com/... | ✓ 苹果.mp3 | 苹果.mp3 |
| 香蕉 | https://drive.google.com/... | ✓ 香蕉.mp3 | 香蕉.mp3 |
| 橙子 | https://drive.google.com/... | ✓ 橙子.mp3 | 橙子.mp3 |
| 葡萄 | https://drive.google.com/... | ✓ 葡萄.mp3 | 葡萄.mp3 |

B列包含直接可用的Google Drive URL，适合WP All Import导入！

### 示例2：英文单词学习
1. 在A列输入：apple、banana、orange、grape
2. 设置B42为：`en`
3. 运行批量TTS转换
4. 获得结果：

| A列 | B列 | C列 | D列 |
|-----|-----|-----|-----|
| 单词 | audio_url | audio_status | audio_filename |
| apple | https://drive.google.com/... | ✓ apple.mp3 | apple.mp3 |
| banana | https://drive.google.com/... | ✓ banana.mp3 | banana.mp3 |
| orange | https://drive.google.com/... | ✓ orange.mp3 | orange.mp3 |
| grape | https://drive.google.com/... | ✓ grape.mp3 | grape.mp3 |

B列包含英文发音的Google Drive URL，可直接导入到WordPress！

## ⚠️ 注意事项

1. **网络连接**：gTTS需要网络连接
2. **API限制**：Google TTS有使用频率限制，大批量转换时会有延迟
3. **文件大小**：每个音频文件约10-50KB
4. **存储空间**：音频文件存储在您的Google Drive中

## 🔍 故障排除

### 常见问题

**Q: 转换失败怎么办？**
A: 检查网络连接，确保单词内容有效，查看Logger日志

**Q: 找不到音频文件？**
A: 检查Google Drive中的"TTS音频文件"文件夹

**Q: 音质不满意？**
A: 目前使用Google TTS，音质已经很好。如需更高音质，可考虑集成Azure TTS

**Q: 批量转换太慢？**
A: 系统已添加1秒延迟避免API限制，这是正常现象

## 🔄 WP All Import + Elementor 配置指南

### 1. **Google表格导出**
- 转换完成后，导出为CSV格式
- 确保列标题为：`单词`, `audio_url`, `audio_status`, `audio_filename`

### 2. **WP All Import设置**
```
字段映射：
- 单词 → WordPress标题
- audio_url → ACF File字段
```

### 3. **ACF字段配置**
```php
// 创建音频字段
array(
    'key' => 'field_word_audio',
    'label' => '单词音频',
    'name' => 'word_audio',
    'type' => 'file',
    'return_format' => 'url',
    'library' => 'all',
    'mime_types' => 'mp3,wav,m4a',
)
```

### 4. **Elementor显示**
```php
// 在Elementor中显示音频
$audio_url = get_field('word_audio');
if ($audio_url) {
    echo '<audio controls>';
    echo '<source src="' . $audio_url . '" type="audio/mpeg">';
    echo '</audio>';
}
```

### 5. **导入流程**
1. 运行TTS转换生成音频文件
2. 导出Google表格为CSV
3. 在WP All Import中配置字段映射
4. 导入数据到WordPress
5. 在Elementor中设计音频播放界面

## 🎉 完美解决方案

现在您拥有了一个完整的解决方案：
- ✅ 保留所有原有功能
- ✅ 新增强大的TTS功能
- ✅ 直接在Google表格中操作
- ✅ 自动保存到Google Drive
- ✅ 完全兼容WP All Import
- ✅ 完美集成Elementor
- ✅ 完全自动化流程

这就是您在Reddit帖子中寻找的完美解决方案！批量转换单词为单独音频文件，自动命名，完全集成在您现有的工作流程中，并且完美支持WordPress导入！
