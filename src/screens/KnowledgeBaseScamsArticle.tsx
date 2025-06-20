import React from 'react';
import KnowledgeBaseArticle from '../components/KnowledgeBaseArticle';
import content from '../knowledgebase/common-digital-scams.md';

const KnowledgeBaseScamsArticle = () => {
  return (
    <KnowledgeBaseArticle
      title="Common Digital Scams"
      subtitle="Examples and tips for avoiding common digital scams"
      content={content}
      createdDate="2023-06-01"
      updatedDate="2024-06-07"
    />
  );
};

export default KnowledgeBaseScamsArticle; 