using System;

namespace Wischi.LD46.KeepItAlive.BridgeNet
{
    public static class TreeEnvironmentConfigs
    {
        public static TreeEnvironmentConfig Debug { get; }
            = new TreeEnvironmentConfigBuilder()
            {
                FullGrownTree = TimeSpan.FromMinutes(10),
                TickRate = TimeSpan.FromMilliseconds(10),
                WaterMax = TimeSpan.FromSeconds(160),
                WaterMin = TimeSpan.FromSeconds(50),
                ScreenRefreshRate = TimeSpan.FromMilliseconds(100),
                DurationUntilDeadWhenUnhealthy = TimeSpan.FromSeconds(1000),
                DurationUntilFullHealthWhenHealthy = TimeSpan.FromSeconds(10),
                InitialWaterLevel = 1,
                SettingPrefix = "develop"
            }.Build();

        public static TreeEnvironmentConfig Release { get; }
            = new TreeEnvironmentConfigBuilder()
            {
                FullGrownTree = TimeSpan.FromDays(365 * 2), // two years
                TickRate = TimeSpan.FromMinutes(15),
                WaterMax = TimeSpan.FromDays(16),
                WaterMin = TimeSpan.FromDays(5),
                ScreenRefreshRate = TimeSpan.FromMinutes(1),
                DurationUntilDeadWhenUnhealthy = TimeSpan.FromDays(14),
                DurationUntilFullHealthWhenHealthy = TimeSpan.FromDays(14),
                InitialWaterLevel = 0.3,
                SettingPrefix = "bonsai"
            }.Build();

        public static TreeEnvironmentConfig NonZensMode { get; }
            = new TreeEnvironmentConfigBuilder()
            {
                FullGrownTree = TimeSpan.FromMinutes(1),
                TickRate = TimeSpan.FromMilliseconds(10),
                WaterMax = TimeSpan.FromSeconds(16),
                WaterMin = TimeSpan.FromSeconds(5),
                ScreenRefreshRate = TimeSpan.FromMilliseconds(100),
                DurationUntilDeadWhenUnhealthy = TimeSpan.FromSeconds(10),
                DurationUntilFullHealthWhenHealthy = TimeSpan.FromSeconds(10),
                InitialWaterLevel = 1,
                SettingPrefix = "debug"
            }.Build();


        public static TreeEnvironmentConfig LudumDare46Test { get; }
            = new TreeEnvironmentConfigBuilder()
            {
                FullGrownTree = TimeSpan.FromHours(2),
                TickRate = TimeSpan.FromMilliseconds(100),
                ScreenRefreshRate = TimeSpan.FromMilliseconds(1000),
                WaterMax = TimeSpan.FromMinutes(15),
                WaterMin = TimeSpan.FromMinutes(30),
                DurationUntilDeadWhenUnhealthy = TimeSpan.FromMinutes(15),
                DurationUntilFullHealthWhenHealthy = TimeSpan.FromMinutes(15),
                InitialWaterLevel = 0.3,
                SettingPrefix = "LD46"
            }.Build();
    }
}
