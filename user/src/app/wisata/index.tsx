  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await apiWisata.getAll();
        if (!mounted) return;
        setData(res);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "Gagal memuat wisata");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }