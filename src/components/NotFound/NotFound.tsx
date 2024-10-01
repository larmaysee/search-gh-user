export default function NotFound({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col justify-center items-center h-[100px] border rounded-lg">
      <h1 className="font-bold text-xl">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
