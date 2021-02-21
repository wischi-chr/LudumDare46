using System;

namespace Wischi.LD46.KeepItAlive.BridgeNet
{
    public class TreeStateFactory
    {
        private readonly Random rng;
        private readonly IClock clock;
        private readonly TreeEnvironmentConfig treeEnvironmentConfig;

        public TreeStateFactory(
            Random rng,
            IClock clock,
            TreeEnvironmentConfig treeEnvironmentConfig
        )
        {
            this.rng = rng ?? throw new ArgumentNullException(nameof(rng));
            this.clock = clock ?? throw new ArgumentNullException(nameof(clock));
            this.treeEnvironmentConfig = treeEnvironmentConfig ?? throw new ArgumentNullException(nameof(treeEnvironmentConfig));
        }

        public TreeState CreateTree()
        {
            var now = clock.Now();

            return new TreeState()
            {
                Seed = rng.Next(),
                Ticks = 0,
                Growth = 0,
                Health = 1,
                StartTimestamp = now,
                WaterLevel = treeEnvironmentConfig.InitialWaterLevel,
                LastEventTimestamp = now,
            };
        }
    }
}
