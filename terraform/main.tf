
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "ap-south-1"
}

# Fetch the latest official Ubuntu 24.04 LTS AMI
data "aws_ssm_parameter" "ubuntu_ami" {
  name = "/aws/service/canonical/ubuntu/server/24.04/stable/current/amd64/hvm/ebs-gp3/ami-id"
}

# Security Group for the Employee Management application
resource "aws_security_group" "employee_sg" {
  name        = "employee-management-sg"
  description = "Allow SSH from my IP and HTTP website traffic"

  # SSH access only from your current public IP
  ingress {
    description = "SSH from my public IP"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.ssh_allowed_cidr]
  }

  # Public website access through HTTP
  ingress {
    description = "HTTP website access"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow outbound traffic for updates and downloads
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "employee-management-sg"
    Project = "employee-management-3tier"
  }
}

# EC2 server running Ubuntu 24.04
resource "aws_instance" "employee_server" {
  ami                         = data.aws_ssm_parameter.ubuntu_ami.value
  instance_type               = "t3.micro"
  key_name                    = "my-bouqet"
  vpc_security_group_ids      = [aws_security_group.employee_sg.id]
  associate_public_ip_address = true

  root_block_device {
    volume_size = 8
    volume_type = "gp3"
    encrypted   = true
  }

  tags = {
    Name    = "employee-management-server"
    Project = "employee-management-3tier"
  }
}

# Display the public IP after creation
output "ec2_public_ip" {
  description = "Public IP of the Employee Management EC2 server"
  value       = aws_instance.employee_server.public_ip
}

# Display the public DNS after creation
output "ec2_public_dns" {
  description = "Public DNS of the Employee Management EC2 server"
  value       = aws_instance.employee_server.public_dns
}

