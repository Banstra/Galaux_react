export default function ProfileLoading() {
  return (
    <main className="min-h-dvh flex items-center justify-center bg-void">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-full border-4 border-neon/30 border-t-neon animate-spin" />
        <p className="text-sm text-slate-400">Загрузка профиля...</p>
      </div>
    </main>
  );
}
