import Head from 'next/head';
// import Image from 'next/image';
import { getProjects, getProjectBySlug } from '@/lib/stemcorner';
import { AspectRatio, Container, Heading, Box, Image } from '@chakra-ui/react';
import { Wrap, WrapItem, Center } from '@chakra-ui/layout';
import {
  Tag,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  TagCloseButton,
} from "@chakra-ui/react";

import { socialImage, url } from '@/lib/config';

import MainLayout from '@/layouts/MainLayout';
import Blocks from '@/components/blocks';
import TextRenderer from 'components/blocks/TextRenderer';

export default function Project({ project }) {
  const { pageInfo, blocks } = project;
  const { pj_name, pj_id, pj_concept, tm_school, pj_image, tm_member, pj_intro, slug, pj_abstract, pj_proposal, tm_leader } = pageInfo.properties;

  const titleContent = pj_name.title[0].text.content;
  const summaryContent = pj_intro.rich_text[0].text.content;
  const slugContent = slug.rich_text[0].plain_text;

  const renderFeaturedImage = () => {
    // if (!pj_image || 
    //   !pj_image.files || 
    //   !pj_image.files[0] || 
    //   !pj_image.files[0].file) {
    //   return null;
    // }

    if (!pj_image?.files[0]?.file){
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
          src={pj_image.files[0].file?.url}
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

      <Container maxW="container.md" mt={[8, 16]} mb={[8, 16]}>
        <Heading
          as="h1"
          mb={[4, 8, null]}
          fontSize={['2xl', '4xl', '5xl']}
          // px={[null, null, 16]}
        >
          {titleContent}
        </Heading>

        {renderFeaturedImage()}

        {/* 介紹 */}
        <Box>
          <Heading size="md">簡介</Heading>
          <TextRenderer content={pj_intro.rich_text} plain />
        </Box>

        {/* School */}
        <Box mt={4}>
          <Heading size="md">學校</Heading>
          <TextRenderer content={tm_school.rich_text} plain />
        </Box>

        {/* TM Leader */}
        <Box mt={4}>
          <Heading size="md">領隊</Heading>
          <TextRenderer content={tm_leader.rich_text} plain />
        </Box>

        {/* TM MEMBER */}
        <Box mt={4}>
          <Heading size="md">學生</Heading>
          <Wrap mt={4}>
            {tm_member.multi_select.map((r) => (
              <WrapItem key={r.name}>
                <Tag>{r.name}</Tag>
              </WrapItem>
            ))}
          </Wrap>
        </Box>

        {/* pj_abstract */}
        <Box mt={4}>
          <Heading size="md">摘要</Heading>
          <TextRenderer content={pj_abstract.rich_text} plain />
        </Box>
        
        {/* pj_concept */}
        <Box mt={4}>
          <Heading size="md">概念</Heading>
          <TextRenderer content={pj_concept.rich_text} plain />
        </Box>
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
