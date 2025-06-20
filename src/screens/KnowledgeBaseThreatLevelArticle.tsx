import React from 'react';
import KnowledgeBaseArticle from '../components/KnowledgeBaseArticle';
import content from '../knowledgebase/how-threat-levels-are-calculated.md';

const KnowledgeBaseThreatLevelArticle = () => {
  return (
    <KnowledgeBaseArticle
      title="How Threat Levels Are Calculated"
      subtitle="The logic behind the app's threat scoring system"
      content={content}
      createdDate="2024-05-01"
      updatedDate="2024-06-07"
    />
  );
};

export default KnowledgeBaseThreatLevelArticle; 