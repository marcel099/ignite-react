import { GetServerSideProps } from "next"
import Head from 'next/head'
import { getSession } from "next-auth/client"
import { RichText } from "prismic-dom"

import { getPrismicClient } from "../../services/prismic"

import styles from './post.module.scss'

type PostProps = {
  post: {
    slug: string
    title: string
    content: string
    updatedAt: string
  }
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post.title} | ig.news</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </>
  )
}

interface PrismicResponse {
  title: any
  content: Array<any>
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const { slug } = params;
  
  if ( slug === 'favicon.png' ) {
    return {
      redirect: {
        destination: `/favicon.png`,
        permanent: false,
      }
    }
  }
  
  const session = await getSession({ req })
  
  if ( !session?.activeSubscription ) {
    return {
      redirect: {
        destination: `/posts/preview/${slug}`,
        permanent: false,
      }
    }
  }

  const prismic = getPrismicClient(req)

  const response = await prismic.getByUID<PrismicResponse>('post', String(slug), {})

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      'pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  return {
    props: {
      post,
    }
  }
}