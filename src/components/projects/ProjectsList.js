import NextLink from 'next/link';
import {
  Button,
  Heading,
  Link,
  SimpleGrid,
  useColorMode,
} from '@chakra-ui/react';

import TextRenderer from '@/components/blocks/TextRenderer';
import ListSkeleton from '@/components/skeleton/ListSkeleton';

const ProjectsList = ({ projects, error, isLoadingMore, loadMore, reachedEnd }) => {
  const { colorMode } = useColorMode();

  const renderProjects = () => {
    if (error) {
      return <p>There was an error while fetching the projects...</p>;
    }

    if (!projects) {
      return <p>It&apos;s looking a bit empty here...</p>;
    }

    return projects.map((r) => {
      const { slug, pj_name, pj_intro } = r.properties;
      return (
        <ProjectItem
          key={r.id}
          slug={slug.rich_text[0]}
          title={pj_name.title[0].text.content}
          summary={pj_intro.rich_text}
        />
      );
    });
  };

  return (
    <>
      <SimpleGrid columns={[1, null, 2]} spacing={8}>
        {renderProjects()}

        {isLoadingMore && (
          <>
            <ListSkeleton type="projects" />
            <ListSkeleton type="projects" />
          </>
        )}
      </SimpleGrid>

      {loadMore && !reachedEnd && (
        <Button
          onClick={loadMore}
          disabled={isLoadingMore}
          colorScheme={colorMode === 'dark' ? 'gray' : 'black'}
          variant={colorMode === 'dark' ? 'solid' : 'outline'}
          w="100%"
          mt={[4, 8]}
          size="lg"
          fontFamily="heading"
          _hover={{ boxShadow: isLoadingMore ? 'unset' : '4px 4px 0 #EB5753' }}
        >
          {isLoadingMore ? 'Loading...' : 'Load more'}
        </Button>
      )}
    </>
  );
};

export default ProjectsList;

const ProjectItem = ({ slug, title, summary }) => {
  const { colorMode } = useColorMode();

  return (
    <NextLink href={`/project/${slug.plain_text}`} passHref>
      <Link
        px={6}
        py={8}
        bg={colorMode === 'dark' ? 'primaryGray' : 'transparent'}
        border="1px"
        borderColor={colorMode === 'dark' ? 'transparent' : 'primaryDark'}
        borderRadius="md"
        _hover={{ textDecoration: 'none', boxShadow: '5px 5px 0 #EB5753' }}
      >
        <Heading as="h2" mb={[2, 4, 6]} fontSize="xl">
          {title}
        </Heading>

        <TextRenderer content={summary} />
      </Link>
    </NextLink>
  );
};
