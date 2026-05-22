resource "aws_elasticache_cluster" "redis" {
  cluster_id = "smartbite-redis"

  engine = "redis"

  node_type = "cache.t3.micro"

  num_cache_nodes = 1
}