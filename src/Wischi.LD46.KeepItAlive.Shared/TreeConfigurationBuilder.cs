using System;

namespace Wischi.LD46.KeepItAlive.BridgeNet
{
    public class TreeEnvironmentConfigBuilder
    {
        public TimeSpan FullGrownTree { get; set; }
        public TimeSpan TickRate { get; set; }
        public TimeSpan WaterMin { get; set; }
        public TimeSpan WaterMax { get; set; }
        public TimeSpan DurationUntilDeadWhenUnhealthy { get; set; }
        public TimeSpan DurationUntilFullHealthWhenHealthy { get; set; }
        public TimeSpan ScreenRefreshRate { get; set; }
        public double InitialWaterLevel { get; set; }
        public string SettingPrefix { get; set; }

        public TreeEnvironmentConfig Build()
        {
            return new TreeEnvironmentConfig(
                GetPerTickValue(FullGrownTree),
                GetPerTickValue(WaterMin),
                GetPerTickValue(WaterMax),
                GetPerTickValue(DurationUntilFullHealthWhenHealthy),
                GetPerTickValue(DurationUntilDeadWhenUnhealthy),
                InitialWaterLevel,
                (int)Math.Round(ScreenRefreshRate.TotalMilliseconds),
                (int)Math.Round(TickRate.TotalMilliseconds),
                SettingPrefix
            );
        }

        private double GetPerTickValue(TimeSpan value)
        {
            return 1.0 / (value.TotalMilliseconds / TickRate.TotalMilliseconds);
        }
    }
}
