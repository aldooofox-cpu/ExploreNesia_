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

  return (
    <FlatList
      contentContainerStyle={styles.listContent}
      data={data}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            // For now navigate to trip tab; filtering can be added later.
            router.push("/trip");
          }}
        >
          {!!item.gambar && (
            <Image source={{ uri: item.gambar }} style={styles.image} resizeMode="cover" />
          )}
          <View style={styles.cardBody}>
            <Text style={styles.title}>{item.nama}</Text>
            <Text numberOfLines={2} style={styles.desc}>
              {item.deskripsi}
            </Text>
            <Text style={styles.loc}>{item.lokasi}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );