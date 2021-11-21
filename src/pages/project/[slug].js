import Head from 'next/head';
import Image from 'next/image';
import { getProjects, getProjectBySlug } from '@/lib/stemcorner';
import { AspectRatio, Container, Heading } from '@chakra-ui/react';
import { socialImage, url } from '@/lib/config';

import MainLayout from '@/layouts/MainLayout';
import Blocks from '@/components/blocks';
import TextRenderer from 'components/blocks/TextRenderer';

export default function Project({ project }) {
  const { pageInfo, blocks } = project;
  const { pj_name, pj_id, tm_school, pj_image, tm_member, pj_intro, slug, pj_abstract, pj_proposal, tm_leader } = pageInfo.properties;

  const titleContent = pj_name.title[0].text.content;
  const summaryContent = pj_intro.rich_text[0].text.content;
  const slugContent = slug.rich_text[0].plain_text;

  const renderFeaturedImage = () => {
    if (!pj_image || !pj_image.url) {
      return null;
    }

    return (
      <AspectRatio
        ratio={16 / 9}
        mb={[4, 8]}
        overflow="hidden"
        borderRadius="lg"
      >
        <Image
          src={pj_image.url}
          alt={titleContent}
          layout="fill"
          objectFit="cover"
        />
      </AspectRatio>
    );
  };

  return (
    <MainLayout>
      <Head>
        <title>{titleContent}</title>
        <meta name="description" content={summaryContent} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={titleContent} />
        <meta property="og:description" content={summaryContent} />
        <meta property="og:url" content={`${url}/${slugContent}`} />
        {/* <meta
          property="og:image"
          content={social_image ? social_image.url : socialImage}
        /> */}
      </Head>

      <Container maxW="container.lg" mt={[8, 16]} mb={[8, 16]}>
        <Heading
          as="h1"
          mb={[4, 8, 16]}
          fontSize={['2xl', '4xl', '5xl']}
          px={[null, null, 16]}
        >
          {titleContent}
        </Heading>

        {renderFeaturedImage()}
        <TextRenderer content={pj_intro.rich_text} plain />
        <TextRenderer content={tm_leader.rich_text} plain />
        <ul>
          {tm_member.multi_select.map((r) => (
            <li key={r.name}>{r.name}</li>
          ))}
        </ul>
      </Container>

      <Container maxW="container.md" px={[5, 6, 16]} pb={16}>
        <Blocks blocks={blocks} />
      </Container>
    </MainLayout>
  );
}

export async function getStaticPaths() {
  const projects = await getProjects();
  
  const paths = projects.data.map((project) => ({
    params: { slug: project.properties.slug.rich_text[0].plain_text },
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const project = await getProjectBySlug(params.slug);

  if (project?.pageInfo?.properties.status.select.name !== 'published') {
    return {
      notFound: true,
      revalidate: 30,
    };
  }

  return { props: { project }, revalidate: 30 };
}
