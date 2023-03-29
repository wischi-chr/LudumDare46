using static H5.Core.es5;

namespace Wischi.LD46.KeepItAlive.BridgeNet
{
    public class BrowserJsClock : IClock
    {
        public double Now()
        {
            return Date.now();
        }
    }
}
