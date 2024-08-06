provider "aws" {
  region = "us-east-1"
}

resource "random_id" "unique_id" {
  byte_length = 4
}

data "aws_caller_identity" "current" {}

data "aws_ami" "latest_runtime_ephemeral_ami" {
  most_recent = true

  filter {
    name   = "name"
    values = ["runtime-epehemeral-*"]
  }

  owners = ["${data.aws_caller_identity.current.account_id}"]
}

locals {
  suffix = random_id.unique_id.hex
  tags = tomap({
    "Name"         = "runtime-ephemeral-${local.suffix}"
    "ManagedBy"    = "Terraform"
    "CreationDate" = time_static.creation_time.rfc3339
  })
}

resource "time_static" "creation_time" {}

resource "aws_instance" "ec2_instance" {
  ami           = data.aws_ami.latest_platform_interview_ami.image_id
  instance_type = "t2.xlarge"
  tags          = local.tags

  vpc_security_group_ids = [aws_security_group.security_group.id]
  user_data              = file("setup.sh")

   provisioner "file" {
    source      = "../bundle/uds-bunle.yaml"
    destination = "/tmp/bundle/uds-bundle.yaml"
  }

   provisioner "file" {
    source      = "../tasks/infra.yaml"
    destination = "/tmp/infra.yaml"
  }


  root_block_device {
    volume_size           = 32
    volume_type           = "gp2"
    delete_on_termination = true
  }
}

resource "aws_security_group" "security_group" {
  name        = "runtime-ephemeral-sg-${random_id.unique_id.hex}"
  description = "kube-api access from anywhere"

  ingress {
    from_port   = 6443
    to_port     = 6443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = local.tags
}
