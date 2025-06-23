# KnowledgeBaseArticleTemplate Usage Guide

This template provides a consistent, feature-rich article viewer for the ThreatSense knowledge base. It includes search functionality, table of contents navigation, and text highlighting.

## Features

- ✅ **Search functionality** - Real-time search within article content
- ✅ **Table of contents** - Modal-based navigation with section jumping
- ✅ **Text highlighting** - Search terms highlighted in results and content
- ✅ **Section navigation** - Click-to-scroll with visual feedback
- ✅ **Responsive design** - Clean, modern UI with gradient backgrounds
- ✅ **Consistent styling** - Unified look across all knowledge base articles

## Usage Example

```tsx
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import KnowledgeBaseArticleTemplate from '../components/KnowledgeBaseArticleTemplate';

const MyKnowledgeBaseArticle = () => {
  const tableOfContents = [
    { id: 'overview', title: 'Overview', level: 1 },
    { id: 'section1', title: 'First Section', level: 1 },
    { id: 'subsection1', title: 'Subsection', level: 2 },
    { id: 'section2', title: 'Second Section', level: 1 },
  ];

  const articleContent = {
    overview: {
      title: 'Overview',
      content: 'This is the overview content...'
    },
    section1: {
      title: 'First Section',
      content: 'This is the first section content...'
    },
    subsection1: {
      title: 'Subsection',
      content: 'This is subsection content...'
    },
    section2: {
      title: 'Second Section',
      content: 'This is the second section content...'
    },
  };

  return (
    <KnowledgeBaseArticleTemplate
      pageTitle="Knowledge Base"
      articleTitle="My Article Title"
      IconComponent={<Icon name="document-outline" size={40} color="#4CAF50" />}
      tableOfContents={tableOfContents}
      articleContent={articleContent}
      themeColor="#4CAF50"
    />
  );
};

export default MyKnowledgeBaseArticle;
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `pageTitle` | string | The title shown in the header |
| `articleTitle` | string | The main article title |
| `IconComponent` | ReactNode | The icon component to display |
| `tableOfContents` | TableOfContentsItem[] | Array of TOC items with id, title, and level |
| `articleContent` | ArticleContent | Object with section content |
| `themeColor` | string | Hex color for theming (used for highlights, borders, etc.) |

## Structure

### TableOfContentsItem
```tsx
interface TableOfContentsItem {
  id: string;        // Must match keys in articleContent
  title: string;     // Display title
  level: number;     // 1 for main sections, 2+ for subsections
}
```

### ArticleContent
```tsx
interface ArticleContent {
  [key: string]: {
    title: string;   // Section title
    content: string; // Section content
  };
}
```

## Notes

- **Live Text Analyzer**: This article uses its own implementation and should NOT be changed - it's the reference implementation
- **Sentry Mode**: Now uses this template (was previously broken)
- **Future articles**: Should use this template for consistency
- **Search functionality**: Works across all sections and highlights matches
- **Navigation**: Table of contents provides quick section jumping

## Best Practices

1. Use descriptive section IDs that match the table of contents
2. Keep content concise and well-structured
3. Use appropriate theme colors for visual consistency
4. Test search functionality with various terms
5. Ensure all sections are included in the table of contents 