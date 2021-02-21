namespace Wischi.LD46.KeepItAlive.BridgeNet
{
    public class TreeState
    {
        public int Seed { get; set; }
        public double Health { get; set; }
        public double WaterLevel { get; set; }
        public double Growth { get; set; }
        public long Ticks { get; set; }
        public double StartTimestamp { get; set; }
        public double LastEventTimestamp { get; set; }
    }
}
