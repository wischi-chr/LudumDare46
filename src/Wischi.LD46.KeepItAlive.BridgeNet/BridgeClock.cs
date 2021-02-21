using Bridge.Html5;

namespace Wischi.LD46.KeepItAlive.BridgeNet
{
    public class BridgeClock : IClock
    {
        public double Now()
        {
            return Date.Now();
        }
    }
}
