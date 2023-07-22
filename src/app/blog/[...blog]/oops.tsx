interface OopsParams {
  message: string
  [key: string]: unknown
}
export default function Oops({ message, ...args }: OopsParams) {
  const isProd = process.env.NODE_ENV === 'production'
  return (
    <>
      <h1>Oops...</h1>
      <p>{`The post you're looking for doesn't exist`}</p>
      {!isProd && (
        <p style={{ color: '#f74b4b' }}>
          Debug: {message}{' '}
          {args && Object.keys(args).length > 0 && (
            <pre>{JSON.stringify(args)}</pre>
          )}
        </p>
      )}
    </>
  )
}
