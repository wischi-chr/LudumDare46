using static H5.Core.dom;

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
            var seedValue = window.localStorage.getItem(seedKey);
            var tickValue = window.localStorage.getItem(tickKey);
            var startValue = window.localStorage.getItem(startKey);
            var growthValue = window.localStorage.getItem(growthKey);
            var healthValue = window.localStorage.getItem(healthKey);
            var waterLevelValue = window.localStorage.getItem(waterLevelKey);
            var lastUpdateValue = window.localStorage.getItem(lastUpdateKey);

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
            window.localStorage.setItem(seedKey, treeState.Seed.ToString());
            window.localStorage.setItem(tickKey, treeState.Ticks.ToString());
            window.localStorage.setItem(healthKey, treeState.Health.ToString());
            window.localStorage.setItem(growthKey, treeState.Growth.ToString());
            window.localStorage.setItem(startKey, treeState.StartTimestamp.ToString());
            window.localStorage.setItem(waterLevelKey, treeState.WaterLevel.ToString());
            window.localStorage.setItem(lastUpdateKey, treeState.LastEventTimestamp.ToString());
        }

        public void RemoveLegacy()
        {
            window.localStorage.removeItem(seedKey);
            window.localStorage.removeItem(tickKey);
            window.localStorage.removeItem(healthKey);
            window.localStorage.removeItem(growthKey);
            window.localStorage.removeItem(startKey);
            window.localStorage.removeItem(waterLevelKey);
            window.localStorage.removeItem(lastUpdateKey);
        }
    }
}
