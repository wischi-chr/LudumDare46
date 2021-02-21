namespace Wischi.LD46.KeepItAlive.BridgeNet
{
    public interface IClock
    {
        /// <summary>
        /// Unix timestamp milliseconds.
        /// </summary>
        double Now();
    }
}
