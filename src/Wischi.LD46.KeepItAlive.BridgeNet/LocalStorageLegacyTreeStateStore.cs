using Bridge.Html5;

namespace Wischi.LD46.KeepItAlive.BridgeNet
{
    /// <summary>
    /// This storage is legacy (since 22.02.2020) and will be removed later.
    /// </summary>
    /// <remarks>
    /// This store is still maintained, until all the trees that are not updated, are dead anyways.
    /// </remarks>
    public class LocalStorageLegacyTreeStateStore : ITreeStateStore
    {
        private readonly string seedKey;
        private readonly string tickKey;
        private readonly string startKey;
        private readonly string growthKey;
        private readonly string healthKey;
        private readonly string lastUpdateKey;
        private readonly string waterLevelKey;

        public LocalStorageLegacyTreeStateStore(string prefix)
        {
            seedKey = prefix + ".Seed";
            tickKey = prefix + ".Ticks";
            startKey = prefix + ".Start";
            growthKey = prefix + ".Growth";
            healthKey = prefix + ".Health";
            lastUpdateKey = prefix + ".LastUpdate";
            waterLevelKey = prefix + ".WaterLevel";
        }

        public TreeState Get()
        {
            var seedValue = Window.LocalStorage.GetItem(seedKey) as string;
            var tickValue = Window.LocalStorage.GetItem(tickKey) as string;
            var startValue = Window.LocalStorage.GetItem(startKey) as string;
            var growthValue = Window.LocalStorage.GetItem(growthKey) as string;
            var healthValue = Window.LocalStorage.GetItem(healthKey) as string;
            var waterLevelValue = Window.LocalStorage.GetItem(waterLevelKey) as string;
            var lastUpdateValue = Window.LocalStorage.GetItem(lastUpdateKey) as string;

            // Use single & to force parse all values even if the first one failed.
            // We do this to prevent a CS0165 uninitialized error.

            var parseSuccess =
                int.TryParse(seedValue, out var seed) &
                int.TryParse(tickValue, out var tick) &
                double.TryParse(startValue, out var start) &
                double.TryParse(growthValue, out var growth) &
                double.TryParse(healthValue, out var health) &
                double.TryParse(lastUpdateValue, out var lastUpdate) &
                double.TryParse(waterLevelValue, out var waterLevel);

            if (!parseSuccess)
            {
                return null;
            }

            return new TreeState()
            {
                Seed = seed,
                Ticks = tick,
                Growth = growth,
                Health = health,
                StartTimestamp = start,
                WaterLevel = waterLevel,
                LastEventTimestamp = lastUpdate,
            };
        }

        public void Set(TreeState treeState)
        {
            Window.LocalStorage.SetItem(seedKey, treeState.Seed);
            Window.LocalStorage.SetItem(tickKey, treeState.Ticks);
            Window.LocalStorage.SetItem(healthKey, treeState.Health);
            Window.LocalStorage.SetItem(growthKey, treeState.Growth);
            Window.LocalStorage.SetItem(startKey, treeState.StartTimestamp);
            Window.LocalStorage.SetItem(waterLevelKey, treeState.WaterLevel);
            Window.LocalStorage.SetItem(lastUpdateKey, treeState.LastEventTimestamp);
        }

        public void RemoveLegacy()
        {
            Window.LocalStorage.RemoveItem(seedKey);
            Window.LocalStorage.RemoveItem(tickKey);
            Window.LocalStorage.RemoveItem(healthKey);
            Window.LocalStorage.RemoveItem(growthKey);
            Window.LocalStorage.RemoveItem(startKey);
            Window.LocalStorage.RemoveItem(waterLevelKey);
            Window.LocalStorage.RemoveItem(lastUpdateKey);
        }
    }
}
