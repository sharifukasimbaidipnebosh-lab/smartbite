resource "aws_db_instance" "postgres" {
  engine = "postgres"

  instance_class = "db.t3.micro"

  allocated_storage = 20

  username = "admin"

  password = "securepassword"
}