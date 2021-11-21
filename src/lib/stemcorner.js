import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_SECRET,
});

const databaseId = process.env.NOTION_STEMCORNER_DB_ID;

export const getProjects = async (cursor) => {
  const response = await notion.databases.query({
    database_id: databaseId,
    page_size: 10,
    start_cursor: cursor ? cursor : undefined,
    filter: {
      and: [
        {
          property: 'status',
          select: {
            equals: 'published',
          },
        },
        {
          property: 'slug',
          rich_text: {
            is_not_empty: true,
          },
        },
      ],
    },
  });

  return {
    data: response.results,
    next_cursor: response.next_cursor,
    has_more: response.has_more,
  };
};

export const getProjectBySlug = async (slug) => {
  const project = await notion.databases.query({
    database_id: databaseId,
    filter: {
      or: [
        {
          property: 'slug',
          text: {
            equals: slug,
          },
        },
      ],
    },
  });

  const pageId = project.results[0].id;

  const page = await notion.pages.retrieve({ page_id: pageId });
  const blocks = await notion.blocks.children.list({ block_id: pageId });

  return { pageInfo: page, blocks: blocks.results };
};

export const getProjectById = async (projectId) => {
  const project = await notion.pages.retrieve({ page_id: projectId });
  const blocks = await notion.blocks.children.list({ block_id: projectId });

  return { pageInfo: project, blocks: blocks.results };
};

export const getReadings = async (cursor) => {
  const response = await notion.databases.query({
    database_id: databaseId,
    page_size: 10,
    start_cursor: cursor ? cursor : undefined,
    filter: {
      and: [
        {
          property: 'status',
          select: {
            equals: 'published',
          },
        }
      ],
    },
  });

  return {
    data: response.results,
    next_cursor: response.next_cursor,
    has_more: response.has_more,
  };
};
