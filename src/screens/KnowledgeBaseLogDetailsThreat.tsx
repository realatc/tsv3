import React from 'react';
import KnowledgeBaseArticle from '../components/KnowledgeBaseArticle';
import content from '../knowledgebase/log-details-threat-tab.md';

const KnowledgeBaseLogDetailsThreat = () => {
  return (
    <KnowledgeBaseArticle
      title="Log Details: Threat Tab"
      subtitle="AI analysis and threat assessment"
      content={content}
      createdDate="2024-12-15"
      updatedDate="2025-06-20"
    />
  );
};

export default KnowledgeBaseLogDetailsThreat; 