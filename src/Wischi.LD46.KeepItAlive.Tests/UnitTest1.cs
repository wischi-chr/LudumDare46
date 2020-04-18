using System;
using Xunit;

namespace Wischi.LD46.KeepItAlive.Tests
{
    public class UnitTest1
    {
        [Fact]
        public void Test1()
        {
            var rndSource = new RandomWrapper();
            var treeBuilder = new TreeBuilder(rndSource);
            var tree = treeBuilder.BuildTree();
        }
    }
}
