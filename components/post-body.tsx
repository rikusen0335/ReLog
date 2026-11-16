type Props = { html: string };

// HTML is rendered by our EmDash server's PortableText component. It is never
// compiled/evaluated as MDX in the Next.js process.
const PostBody = ({ html }: Props) => (
  <div className="max-w-5xl mx-auto">
    <div
      className="max-w-4xl px-4 -mx-2 md:mx-auto md:px-16 py-8 bg-[#fafafc] dark:bg-[#121120] markdown emdash-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  </div>
);

export default PostBody;
