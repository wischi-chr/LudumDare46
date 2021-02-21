namespace Wischi.LD46.KeepItAlive.BridgeNet
{
    public class TreeEnvironmentConfig

    {
        public TreeEnvironmentConfig(
            double maxGrowthRate,
            double minWaterRate,
            double maxWaterRate,
            double healRate,
            double harmRate,
            double initialWaterLevel,
            int msRefreshRate,
            int msTickRate,
            string settingPrefix
        )
        {
            MaxGrowthRate = maxGrowthRate;
            MinWaterRate = minWaterRate;
            MaxWaterRate = maxWaterRate;
            HealRate = healRate;
            HarmRate = harmRate;
            InitialWaterLevel = initialWaterLevel;
            MsRefreshRate = msRefreshRate;
            MsTickRate = msTickRate;
            SettingPrefix = settingPrefix;
        }

        public double MaxGrowthRate { get; set; }
        public double MinWaterRate { get; set; }
        public double MaxWaterRate { get; set; }
        public double HealRate { get; set; }
        public double HarmRate { get; set; }
        public double InitialWaterLevel { get; }
        public int MsRefreshRate { get; }
        public int MsTickRate { get; }
        public string SettingPrefix { get; }
    }
}
