import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box, Container, Flex, Heading } from '@chakra-ui/react';
import { name, description, url, socialImage } from '@/lib/config';
import { usePaginateProjects } from '@/lib/projects';

import MainLayout from '@/layouts/MainLayout';
import ProjectsList from '@/components/projects/ProjectsList';

export default function Projects() {
  const { pathname } = useRouter();

  const { projects, error, isLoadingMore, size, setSize, reachedEnd } =
    usePaginateProjects();

  return (
    <MainLayout>
      <Head>
        <title>{name} - all projects</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={`${name} - all projects`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url + pathname} />
        <meta property="og:image" content={socialImage} />
      </Head>

      <Container maxW="container.lg" pb={16}>
        <Box mb={[8, 16]}>
          <Flex align="center" justify="space-between" px={[4, 8]} mb={6}>
            <Heading as="h2" fontSize="xl">
              All projects
            </Heading>
          </Flex>

          <ProjectsList
            projects={projects}
            error={error}
            isLoadingMore={isLoadingMore}
            loadMore={() => setSize(size + 1)}
            reachedEnd={reachedEnd}
          />
        </Box>
      </Container>
    </MainLayout>
  );
}
